import SQS from "./index";
import AWS from "aws-sdk";

describe("SQS", () => {
  let options;
  let SQSHappyMock;
  let SQSSadMock;
  let sqsHappyMockSpy;
  beforeEach(() => {
    options = {
      awsRegion: "AWS_REGION",
      messageBatchSize: 10,
      queueUrl: "QUEUE_URL"
    };

    sqsHappyMockSpy = jasmine.createSpyObj("sqsHappyMockSpy", [
      "deleteMessage",
      "deleteMessageBatch",
      "receiveMessage",
      "sendMessageBatch"
    ]);
    sqsHappyMockSpy.deleteMessage.and.callFake(() => {
      return {
        promise: () => Promise.resolve({ RequestId: "DeletedMessageID" })
      };
    });
    sqsHappyMockSpy.deleteMessageBatch.and.callFake(() => {
      return {
        promise: () => Promise.resolve([{ RequestId: "DeletedMessageID" }])
      };
    });
    sqsHappyMockSpy.receiveMessage.and.callFake(() => {
      return {
        promise: () => Promise.resolve({ Messages: ["message"] })
      };
    });
    sqsHappyMockSpy.sendMessageBatch.and.callFake(() => {
      return {
        promise: () => Promise.resolve({})
      };
    });

    SQSHappyMock = function() {
      this.deleteMessage = sqsHappyMockSpy.deleteMessage;
      this.deleteMessageBatch = sqsHappyMockSpy.deleteMessageBatch;
      this.receiveMessage = sqsHappyMockSpy.receiveMessage;
      this.sendMessageBatch = sqsHappyMockSpy.sendMessageBatch;
    };

    SQSSadMock = function() {
      this.deleteMessage = function() {
        return {
          promise: () => Promise.reject("deleteMessage ERROR")
        };
      };
      this.deleteMessageBatch = function() {
        return {
          promise: () => Promise.reject("deleteMessageBatch ERROR")
        };
      };
      this.receiveMessage = function() {
        return {
          promise: () => Promise.reject("receiveMessage ERROR")
        };
      };
      this.sendMessageBatch = function() {
        return {
          promise: () => Promise.reject("sendMessageBatch ERROR")
        };
      };
    };

    spyOn(AWS, "SQS");
  });

  describe("constructor", () => {
    it("should throw if options are not provided", () => {
      expect(() => new SQS()).toThrowError(/options/);
      expect(() => new SQS(null)).toThrowError(/options/);
      expect(() => new SQS(false)).toThrowError(/options/);
      expect(() => new SQS("")).toThrowError(/options/);
    });

    it("should throw if options does not have a valid awsRegion property", () => {
      delete options.awsRegion;
      expect(() => new SQS(options)).toThrowError(/awsRegion/);

      options.awsRegion = "";
      expect(() => new SQS(options)).toThrowError(/awsRegion/);

      options.awsRegion = 1234;
      expect(() => new SQS(options)).toThrowError(/awsRegion/);
    });

    it("should throw if options does not have a valid queueUrl property", () => {
      delete options.queueUrl;
      expect(() => new SQS(options)).toThrowError(/queueUrl/);

      options.queueUrl = "";
      expect(() => new SQS(options)).toThrowError(/queueUrl/);

      options.queueUrl = 1234;
      expect(() => new SQS(options)).toThrowError(/queueUrl/);
    });

    it("should throw if options does not have a valid messageBatchSize property", () => {
      options.messageBatchSize = "1234";
      expect(() => new SQS(options)).toThrowError(/messageBatchSize/);
    });

    it("should default the value of the messageBatchSize", () => {
      delete options.messageBatchSize;
      const sqs = new SQS(options);
      expect(sqs.messageBatchSize).toEqual(1);
    });
  });

  describe("new instance", () => {
    it("should not be allowed to change it's properties", () => {
      const sqs = new SQS(options);
      expect(() => {
        sqs.awsRegion = {};
      }).toThrow();
      expect(() => {
        sqs.queueUrl = {};
      }).toThrow();
      expect(() => {
        sqs.messageBatchSize = {};
      }).toThrow();
    });

    it("should properly create and set the attributes on sqs", () => {
      const sqs = new SQS(options);
      expect(sqs.awsRegion).toEqual(options.awsRegion);
      expect(sqs.queueUrl).toEqual(options.queueUrl);
      expect(sqs.messageBatchSize).toEqual(options.messageBatchSize);
    });
  });

  describe("receiveMessageBatch", () => {
    it("should retrieve messages", async () => {
      AWS.SQS.and.callFake(SQSHappyMock);

      const sqs = new SQS(options);

      let messageBatch = await sqs.receiveMessageBatch();
      expect(messageBatch).toEqual({ Messages: ["message"] });
    });

    it("should handle error messages", async () => {
      AWS.SQS.and.callFake(SQSSadMock);

      const sqs = new SQS(options);

      try {
        let messageBatch = await sqs.receiveMessageBatch();
        fail();
      } catch (error) {
        expect(error).toEqual("receiveMessage ERROR");
      }
    });
  });

  describe("deleteMessage", () => {
    it("should delete a message", async () => {
      AWS.SQS.and.callFake(SQSHappyMock);

      const sqs = new SQS(options);

      let messageBatch = await sqs.deleteMessage();
      expect(messageBatch).toEqual({ RequestId: "DeletedMessageID" });
    });

    it("should handle error messages", async () => {
      AWS.SQS.and.callFake(SQSSadMock);

      const sqs = new SQS(options);

      try {
        let deletedMessageResponse = await sqs.deleteMessage();
        fail();
      } catch (error) {
        expect(error).toEqual("deleteMessage ERROR");
      }
    });
  });

  describe("deleteMessageBatch", () => {
    it("should delete a message", async () => {
      AWS.SQS.and.callFake(SQSHappyMock);

      const sqs = new SQS(options);

      let messageBatch = await sqs.deleteMessageBatch(["DeletedMessageID"]);
      expect(messageBatch).toEqual([{ RequestId: "DeletedMessageID" }]);
    });

    it("should handle error messages", async () => {
      AWS.SQS.and.callFake(SQSSadMock);

      const sqs = new SQS(options);

      try {
        let deletedMessageResponse = await sqs.deleteMessageBatch([
          "DeletedMessageID"
        ]);
        fail();
      } catch (error) {
        expect(error).toEqual("deleteMessageBatch ERROR");
      }
    });
  });

  describe("sendMessageBatch", () => {
    it("should send a message batch", async () => {
      AWS.SQS.and.callFake(SQSHappyMock);

      const sqs = new SQS(options);
      const fakeMessageBatch = [{ body: "message1" }, { body: "message2" }];
      let messageBatch = await sqs.sendMessageBatch(fakeMessageBatch);

      expect(sqsHappyMockSpy.sendMessageBatch).toHaveBeenCalled();
    });

    it("should reject if messages is not an array", async () => {
      AWS.SQS.and.callFake(SQSHappyMock);

      const sqs = new SQS(options);

      try {
        await sqs.sendMessageBatch({});
        fail();
      } catch (error) {
        expect(error.message).toContain("Array");
      }
    });
  });
});
