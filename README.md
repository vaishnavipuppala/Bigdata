# Advanced Big Data Indexing Techniques

## INFO-7255: Distributed Software Systems 

This RESTful API project provides a powerful and flexible solution designed to handle structured JSON data with a comprehensive range of features. It is equipped with robust CRUD capabilities, advanced conditional operations, and integrated search functionalities using Elasticsearch, making it ideal for indexing techniques in distributed systems.

---

## Features

### CRUD Operations
- **Create, Read, Update, Delete**: Full support for CRUD operations.
- **Advanced Functionality**:
  - PATCH support for partial updates.
  - Cascaded delete functionality to handle hierarchical data.

### Conditional Operations
- **Update if Not Changed**: Ensures data integrity during updates.
- **Conditional Read and Write**: Executes operations based on specific conditions.

### Data Modeling and Validation
- **JSON Schema Validation**: Ensures data consistency and integrity using a robust schema for all data models.

### Data Storage
- **Redis Integration**: Efficient key-value data storage for high performance and scalability.

### Search Capabilities
- **Elasticsearch Integration**: Leverages Elasticsearch for powerful search functionalities, including:
  - Parent-child indexing for complex data relationships.
  - Join operations for efficient querying.

### Queueing Mechanism
- Efficient handling of requests and data processing using RabbitMQ.

### Security
- **Robust Security Protocols**: Ensures data safety and integrity throughout the API.

---

### Endpoint URLs
- **Elasticsearch**: [http://localhost:9200](http://localhost:9200)
- **Kibana**: [http://localhost:5610](http://localhost:5610)
- **RabbitMQ**: [http://localhost:15672](http://localhost:15672)

---


### Key Storage
- Store the private key in a secure server location for token signing.
- Use the public key for verifying token authenticity.

### Token Workflow
- **Creation**:
  - Use a JWT library to create tokens.
  - Include necessary claims such as user identity, issuance time, and expiration.
  - Sign the token with the private key.
- **Verification**:
  - Verify the token’s signature using the public key.
  - Check for token expiration and payload integrity.

---

## Data Model
The API uses the following JSON schema to define its data model:

```json
{
    "planCostShares": {
        "deductible": 2000,
        "_org": "example.com",
        "copay": 23,
        "objectId": "1234vxc2324sdf-501",
        "objectType": "membercostshare"
    },
    "linkedPlanServices": [
        {
            "linkedService": {
                "_org": "example.com",
                "objectId": "1234520xvc30asdf-502",
                "objectType": "service",
                "name": "Yearly physical"
            },
            "planserviceCostShares": {
                "deductible": 10,
                "_org": "example.com",
                "copay": 0,
                "objectId": "1234512xvc1314asdfs-503",
                "objectType": "membercostshare"
            },
            "_org": "example.com",
            "objectId": "27283xvx9asdff-504",
            "objectType": "planservice"
        },
        {
            "linkedService": {
                "_org": "example.com",
                "objectId": "1234520xvc30sfs-505",
                "objectType": "service",
                "name": "well baby"
            },
            "planserviceCostShares": {
                "deductible": 10,
                "_org": "example.com",
                "copay": 175,
                "objectId": "1234512xvc1314sdfsd-506",
                "objectType": "membercostshare"
            },
            "_org": "example.com",
            "objectId": "27283xvx9sdf-507",
            "objectType": "planservice"
        }
    ],
    "_org": "example.com",
    "objectId": "12xvxc345ssdsds-508",
    "objectType": "plan",
    "planType": "inNetwork",
    "creationDate": "12-12-2017"
}
```

---

## Data Storage

The API uses Redis as a key-value store for efficient data management and retrieval. Redis provides high-performance data operations suitable for real-time applications.



