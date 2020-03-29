export function getUserEmail(attributes, username) {
  for (let i = 0; i < attributes.length; i++) {
    const attributeObject = attributes[i];
    if (attributeObject.Name === 'email') {
      return attributeObject.Value;
    }
  }
  throw new Error(`
    Error in Mission Life New User Email Notification Lambda.
    New Cognito User does not have email attribute. Username: ${username}
  `);
}

export function getUserTempPassword(attributes, username) {
  for (let i = 0; i < attributes.length; i++) {
    const attributeObject = attributes[i];
    if (attributeObject.Name === 'custom:custom-tmp-pwd') {
      return attributeObject.Value;
    }
  }
  throw new Error(`
    Error in Mission Life New User Email Notification Lambda.
    New Cognito User does not have temp password attribute. Username: ${username}
  `);
}

export function getUserFoundation(attributes, username) {
  for (let i = 0; i < attributes.length; i++) {
    const attributeObject = attributes[i];
    if (attributeObject.Name === 'custom:foundation') {
      return attributeObject.Value;
    }
  }
  throw new Error(`
    Error in Mission Life New User Email Notification Lambda.
    New Cognito User does not have temp password attribute. Username: ${username}
  `);
}