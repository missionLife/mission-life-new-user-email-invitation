// Use the AWS.CognitoIdentityServiceProvider AdminCreateUser
import AWS from "aws-sdk";
import NewUser from "./shared/models/new-user";
import GeneratePassword from "generate-password";
import * as CognitoUserUtils from './shared/cognito-user-utils';


AWS.config.setPromisesDependency(Promise);
AWS.config.update({ region: process.env.AWS_REGION });

const ses = new AWS.SES({
  region: 'us-east-1'
});
const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
const MissionLifeLogo = 'https://mission-life-assets.s3.us-east-2.amazonaws.com/ml-logo-menu-2.original.png';
const MissionLifeWorldLogo = 'https://mission-life-assets.s3.us-east-2.amazonaws.com/ml-world.original.png';
const MissionLifeAppUrl = 'https://d1s3z7p9p47ieq.cloudfront.net/';
const socialMediaIconFacebook = 'https://mission-life-assets.s3.us-east-2.amazonaws.com/iconfinder_1_Facebook_colored_svg_copy_5296499.png';
const socialMediaIconInstagram = 'https://mission-life-assets.s3.us-east-2.amazonaws.com/iconfinder_social-instagram-new-circle_1164349.png';
const socialMediaIconTwitter = 'https://mission-life-assets.s3.us-east-2.amazonaws.com/iconfinder_Twitter_2062092.png';

async function createCognitoUsers(messages) {
  const batchPromises = [];

  for (let i = 0; i < messages.length; i++) {
    const newUser = new NewUser(JSON.parse(messages[i].body));
    const temporaryPassword = GeneratePassword.generate({
      length: 10,
      numbers: true,
      strict: true
    });

    console.log("THE NEW USER: ", newUser);
    console.log("THE NEW USER TEMP PASSWORD: ", temporaryPassword);

    var params = {
      UserPoolId: process.env.MISSION_LIFE_COGNITO_USER_POOL_ID /* required */,
      Username: newUser.email /* required */,
      ForceAliasCreation: false,
      MessageAction: "SUPPRESS",
      TemporaryPassword: temporaryPassword,
      UserAttributes: [
        {
          Name: "email" /* required */,
          Value: newUser.email
        },
        {
          Name: "custom:custom-tmp-pwd",
          Value: temporaryPassword
        },
        {
          Name: 'custom:foundation',
          Value: newUser.foundation
        },
        {
          Name: 'email_verified',
          Value: 'true'
        }
        /* more items */
      ]
    };

    batchPromises.push(
      cognitoidentityserviceprovider.adminCreateUser(params).promise()
    );
  }

  return Promise.all(batchPromises);
}

async function sendNewUserEmail(newUsers) {
  console.log("NEW CREATED USERS: ", JSON.stringify(newUsers, null, 2));

  const batchPromises = [];

  for (let i = 0; i < newUsers.length; i++) {
    const newUser = newUsers[i];
    console.log('NEW USER OBJECT: ', JSON.stringify(newUser,null,2));
    console.log('NEW USER OBJECT ATTRIBUTES: ', JSON.stringify(newUser.User.Attributes,null,2));
    const newUserEmail = CognitoUserUtils.getUserEmail(
      newUser.User.Attributes,
      newUser.User.Username
    );
    const newUserTempPassword = CognitoUserUtils.getUserTempPassword(
      newUser.User.Attributes,
      newUser.User.Username
    );
    const newUserFoundation = CognitoUserUtils.getUserFoundation(
      newUser.User.Attributes,
      newUser.User.Username
    )
    console.log('NEW USER EMAIL: ', newUserEmail);
    // Replace sender@example.com with your "From" address.
    // This address must be verified with Amazon SES.
    const sender = "Mission Life Change <admin@missionlifechange.org>";

    // Replace recipient@example.com with a "To" address. If your account
    // is still in the sandbox, this address must be verified.
    const recipient = `<${newUserEmail}>`;

    // The subject line for the email.
    const subject = "Welcome to Mission Life";

    // The email body for recipients with non-HTML email clients.
    const body_text =
      "Getting Started\r\n" +
      "Welcome to the Mission Life Change. " +
      "We've created a login with a temporary password for you. ";
      `Your username is ${newUserEmail}. `;
      `And your temporary password is ${newUserTempPassword}`;

    // The HTML body of the email.
    const body_html = `
      <html>
        <head></head>
        <body 
          style="margin: 0; padding: 0;"
          >
          <table 
            align="center" 
            cellpadding="0" 
            cellspacing="0" 
            width="600"
            >
            <tr>
              <td
                align="right"
                bgcolor="transparent"
                style="padding: 40px 0 0px 0; font-family: Arial, sans-serif;"
              >
                <img
                  src="${MissionLifeWorldLogo}"
                  alt="Welcome to Mission Life Change"
                  width="82"
                  height="82"
                  style="display: block;"
                />
              </td>
            </tr>
            <tr>
              <td 
                bgcolor="#ffffff" 
                style="padding: 0px 30px 40px 30px;"
                >
                <table 
                  cellpadding="0" 
                  cellspacing="0" 
                  width="100%"
                  >
                  <tr>
                    <td>
                      <h1
                        style="padding:0; margin: 0;  text-align: center; font-family: Arial, sans-serif;"
                        >
                        Mission Life
                      </h1>
                      <p
                        style="font-size: 18px;padding:0; margin: 0;text-align: center; font-family: Arial, sans-serif;"
                        >
                        #ChangeOne
                      <p/>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p
                        style="font-size: 18px;padding:10px 0px 0px 0px; margin: 0;text-align: center; font-family: Arial, sans-serif;"
                        >
                        <span 
                          style="font-weight: bold; color: #e34f26"
                          >
                            ${newUserFoundation}
                        </span>
                        | Thank you for your support
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td 
                      style="text-align:center; border-bottom: 1px solid #e3e6ea;"
                      >
                      <p
                        style="text-align: center; font-family: Arial, sans-serif; font-size: 18px;"
                      >
                        We've created a login with a temporary password for you.<br />
                        Your username is <strong>${newUserEmail}</strong>.<br />
                        And your temporary password is
                        <strong>${newUserTempPassword}</strong><br />
                        <a
                          style="display:inline-block;margin:30px 0px;color:#e34f26;background: #FFFFFF; border: 3px solid #e34f26;padding: 11px 38px 11px 38px;font-weight: bold;text-align: center;font-family: Arial, sans-serif;border-radius:4px;text-decoration: none;"
                          href="${MissionLifeAppUrl}"
                        >
                          Click here to login
                        </a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td
                bgcolor="#62ba45"
                style="text-align: center;padding: 40px 30px 40px 30px;"
              >
                <table 
                  cellpadding="0" 
                  cellspacing="0" 
                  width="100%"
                  >
                  <tr>
                    <td>
                      <img
                        src="${MissionLifeLogo}"
                        alt="Mission Life"
                        width="313"
                        height="61"
                        style="display: block; margin: auto;"
                      />
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="color: #ffffff;font-family: Arial, sans-serif; font-size: 16px;margin:25px;"
                    >
                      <p 
                        style="font-weight: bold; color: #e34f26; font-size:24px;text-align:center;"
                        >
                        Contact Us
                      </p>
                      <p
                        style="text-align:center;"
                        >
                        (603) 233-3444
                      </p>
                      <p
                        style="text-align:center;text-decoration:none;"
                        >
                        admin@missionlifechange.org
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td
                      style="color: #ffffff;font-family: Arial, sans-serif; font-size: 16px;width: 100%;"
                    >
                      <a
                        style="text-decoration:none;display:inline-block;margin:auto;"
                        href="https://www.facebook.com/missionlifechange.org/"
                      >
                        <img
                          src="${socialMediaIconFacebook}"
                          style="margin:5px 5px 5px 5px;display:inline-block;"
                          width="36px"
                        />
                      </a>
                      <a
                        style="text-decoration:none;display:inline-block;margin:auto;"
                        href="https://twitter.com/MissionLifeOne"
                      >
                        <img
                          src="${socialMediaIconTwitter}"
                          style="margin:5px 5px 5px 5px;display:inline-block;"
                          width="36px"
                        />
                      </a>
                      <a
                        style="text-decoration:none;display:inline-block;margin:auto;"
                        href="https://www.instagram.com/missionlifechange/"
                      >
                        <img
                          src="${socialMediaIconInstagram}"
                          style="margin:5px 5px 5px 5px;display:inline-block;"
                          width="36px"
                        />
                      </a>
                      <p
                        style="text-align:center;"
                        >
                        Mission Life, P.0. Box 1771, Manchester, NH 03105
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    // The character encoding for the email.
    const charset = "UTF-8";

    // Specify the parameters to pass to the API.
    var params = {
      Source: sender,
      Destination: {
        ToAddresses: [recipient]
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: charset
        },
        Body: {
          Text: {
            Data: body_text,
            Charset: charset
          },
          Html: {
            Data: body_html,
            Charset: charset
          }
        }
      }
    };
    console.log('THE SES PARAMS: ', JSON.stringify(params,null,2));
    //Try to send the email.
    batchPromises.push(ses.sendEmail(params).promise());
  }
  return Promise.all(batchPromises);
}

async function consume(event, context) {
  const cognitoCreatedUsers = await createCognitoUsers(event.Records);

  return sendNewUserEmail(cognitoCreatedUsers);
}
exports.handler = async (event, context) => {
  try {
    return await consume(event, context);
  } catch (error) {
    throw new Error(
      `An error occurred in the Mission Life New User Email Notification Lambda: ${error.message}`
    );
  }
};
