

exports.handler = async (event, context) => {
  try {
    return `Successful call. Print env - ${process.env.TEST_ENV} - in the Mission Life New Users Scheduler Lambda`;
  } catch (error) {
    throw new Error(`An error occurred in the Mission Life New Users Scheduler Lambda: ${error.message}`);
  }
};