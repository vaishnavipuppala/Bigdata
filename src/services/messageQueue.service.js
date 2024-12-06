export class MessageQueueService {
    constructor(channel) {
      this.channel = channel;
      this.queues = {
        CREATE: 'plan-created',
        UPDATE: 'plan-updated',
        DELETE: 'plan-deleted'
      };
    }
  
    async initialize() {
      try {
        for (const queue of Object.values(this.queues)) {
          await this.channel.assertQueue(queue, { durable: true, autoDelete: false });
        }
        console.log('Message queues initialized successfully');
      } catch (error) {
        console.error('Error initializing message queues:', error);
        throw error;
      }
    }
  
    async publishMessage(queue, data) {
      try {
        if (typeof data !== 'object' || data === null) {
          throw new Error('Message data must be a non-null object');
        }
        await this.channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), { persistent: true });
        console.log(`Message published to queue: ${queue}`);
      } catch (error) {
        console.error('Error publishing message:', error);
        throw error;
      }
    }
  
    async startConsumer(queueName, callback) {
      try {
        await this.channel.consume(queueName, async (msg) => {
          if (msg) {
            try {
              const data = JSON.parse(msg.content.toString());
              console.log(`Message received from ${queueName}:`, data);
              await callback(data);
              this.channel.ack(msg);
            } catch (error) {
              console.error(`Error processing message from ${queueName}:`, error);
              this.channel.nack(msg, false, true);
            }
          }
        });
        console.log(`Started consuming messages from queue: ${queueName}`);
      } catch (error) {
        console.error(`Error starting consumer for ${queueName}:`, error);
        throw error;
      }
    }
  }
  