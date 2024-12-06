
import amqp from 'amqplib';

const initializeRabbitMQ = async () => {
  const maxRetries = 5;
  let retries = 0;

  while (retries < maxRetries) {
      try {
          console.log('Attempting to connect to RabbitMQ...');
          const connection = await amqp.connect({
              protocol: 'amqp',
              hostname: '127.0.0.1',
              port: 5672,
              username: 'vaishnavi',
              password: 'maggi123',
              vhost: '/'
          });
          
          const channel = await connection.createChannel();
          
          // Setup basic queues
          const queues = ['plan-created', 'plan-updated', 'plan-deleted'];
          for (const queue of queues) {
              await channel.assertQueue(queue, {
                  durable: true
              });
          }

          // Set channel prefetch
          await channel.prefetch(1);

          console.log('Successfully connected to RabbitMQ');
          return { connection, channel };
      } catch (error) {
          retries++;
          console.error(`Failed to connect to RabbitMQ (attempt ${retries}/${maxRetries}):`, error.message);
          if (retries === maxRetries) {
              throw new Error(`Failed to connect to RabbitMQ after ${maxRetries} attempts: ${error.message}`);
          }
          await new Promise(resolve => setTimeout(resolve, retries * 5000));
      }
  }
};