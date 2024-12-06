
import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.ELASTICSEARCH_URL) {
    console.error('Error: ELASTICSEARCH_URL is not set in the environment variables.');
    process.exit(1);
}

const esClient = new Client({
    node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    auth: {
        username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
        password: process.env.ELASTICSEARCH_PASSWORD || 'maggi123'
    },
    maxRetries: 5, // Retry 5 times on failure
    requestTimeout: 60000, // Timeout after 60 seconds
    sniffOnStart: true // Automatically discover other cluster nodes
});

// Test connection on initialization
const testElasticsearchConnection = async () => {
    try {
        const health = await esClient.cluster.health();
        console.log('Elasticsearch cluster health:', health.body);
    } catch (error) {
        console.error('Error connecting to Elasticsearch:', error.message);
        console.error('Ensure Elasticsearch is running and the configuration is correct.');
        process.exit(1); // Exit process if unable to connect
    }
};

testElasticsearchConnection();

export { esClient };
