// Use the AWS.CognitoIdentityServiceProvider AdminCreateUser
import AWS from 'aws-sdk';
import NewUser from './shared/models/new-user';
import GeneratePassword from 'generate-password';

AWS.config.setPromisesDependency(Promise);
AWS.config.update({ region: process.env.AWS_REGION });

const cognitoidentityserviceprovider = new AWS.CognitoIdentityServiceProvider();
const ses = new AWS.SES();

async function createCognitoUsers(messages) {
  const batchPromises = [];

  for (let i = 0; i < messages.length; i++) {
    const newUser = new NewUser(JSON.parse(messages[i].body));
    const temporaryPassword = GeneratePassword.generate({
      length: 10,
      numbers: true,
      strict: true
    });

    console.log('THE NEW USER: ', newUser);
    console.log('THE NEW USER TEMP PASSWORD: ', temporaryPassword);

    var params = {
      UserPoolId: process.env.MISSION_LIFE_COGNITO_USER_POOL_ID, /* required */
      Username: newUser.email, /* required */
      ForceAliasCreation: false,
      MessageAction: 'SUPPRESS',
      TemporaryPassword: temporaryPassword,
      UserAttributes: [
        {
          Name: 'email', /* required */
          Value: newUser.email
        },
        {
          Name: 'custom:custom-tmp-pwd',
          Value: temporaryPassword
        }
        /* more items */
      ]
    };

    batchPromises.push(cognitoidentityserviceprovider.adminCreateUser(params).promise())
  }

  return Promise.all(batchPromises);
}

async function sendNewUserEmail(newUsers) {

  const batchPromises = [];

  for (let i = 0; i < newUsers.length; i++) {
    const newUser = newUsers[i];
    // Replace sender@example.com with your "From" address.
    // This address must be verified with Amazon SES.
    const sender = "Admin <admin@missionlifechange.org>";

    // Replace recipient@example.com with a "To" address. If your account 
    // is still in the sandbox, this address must be verified.
    const recipient = newUser.email;

    // Specify a configuration set. If you do not want to use a configuration
    // set, comment the following variable, and the 
    // ConfigurationSetName : configuration_set argument below.
    const configuration_set = "ConfigSet";

    // The subject line for the email.
    const subject = "Welcome to Mission Life";

    // The email body for recipients with non-HTML email clients.
    const body_text = "Amazon SES Test (SDK for JavaScript in Node.js)\r\n"
                    + "This email was sent with Amazon SES using the "
                    + "AWS SDK for JavaScript in Node.js.";
                
    // The HTML body of the email.
    const body_html = `<html>
    <head></head>
    <body>
      <h1>Amazon SES Test (SDK for JavaScript in Node.js)</h1>
      <p>This email was sent with
        <a href='https://aws.amazon.com/ses/'>Amazon SES</a> using the
        <a href='https://aws.amazon.com/sdk-for-node-js/'>
          AWS SDK for JavaScript in Node.js</a>.</p>
    </body>
    </html>`;

    // The character encoding for the email.
    const charset = "UTF-8";

    // Create a new SES object. 
    var ses = new aws.SES();

    // Specify the parameters to pass to the API.
    var params = { 
      Source: sender, 
      Destination: { 
        ToAddresses: [
          recipient 
        ],
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
      },
      ConfigurationSetName: configuration_set
    };

    //Try to send the email.
    batchPromises.push(ses.sendEmail(params).promise());
  }
  return Promise.all(batchPromises);
}

async function consume(event, context) {
  // const cognitoCreatedUsers = await createCognitoUsers(event.Records);

  // return sendNewUserEmail();
  return createCognitoUsers(event.Records);
};
exports.handler = async (event, context) => {
  try {
    return await consume(event, context);
  } catch (error) {
    throw new Error(`An error occurred in the Mission Life New Users Producer Lambda: ${error.message}`);
  }
};