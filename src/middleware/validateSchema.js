// import Ajv from 'ajv';
// import { readFile } from 'fs/promises';
// import { fileURLToPath } from 'url';
// import { dirname, join } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// const ajv = new Ajv({ strict: true, allErrors: true });

// // Custom format for DD-MM-YYYY
// ajv.addFormat("custom-date", {
//   validate: (dateString) => {
//     if (typeof dateString !== 'string') return false;
//     const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
//     if (!regex.test(dateString)) return false;
    
//     const [, day, month, year] = dateString.match(regex);
//     const date = new Date(year, month - 1, day);
//     return date && date.getMonth() + 1 == month && date.getDate() == day;
//   }
// });

// // Create a function that returns the middleware
// const createValidateSchemaMiddleware = async () => {
//   const schemaPath = join(__dirname, '..', 'models', 'planSchema.json');
//   const planSchemaJson = await readFile(schemaPath, 'utf8');
//   const planSchema = JSON.parse(planSchemaJson);

//   // Add custom format to creationDate in the schema
//   if (planSchema.properties && planSchema.properties.creationDate) {
//     planSchema.properties.creationDate.format = "custom-date";
//   }

//   const validate = ajv.compile(planSchema);

//   // Return the actual middleware function
//   return (req, res, next) => {
//     const valid = validate(req.body);
    
//     if (!valid) {
//       return res.status(400).json({
//         error: 'Validation failed',
//         details: validate.errors.map(err => ({
//           field: err.instancePath,
//           message: err.message
//         }))
//       });
//     }
    
//     next();
//   };
// };

// export default createValidateSchemaMiddleware;
// src/middleware/validateSchema.js

import Ajv from 'ajv';
import { readFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const ajv = new Ajv({
  strict: true,
  allErrors: true,
  removeAdditional: true,
  useDefaults: true
});

// Add custom formats
ajv.addFormat("custom-date", {
  validate: (dateString) => {
    if (typeof dateString !== 'string') return false;
    const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
    if (!regex.test(dateString)) return false;
    
    const [, day, month, year] = dateString.match(regex);
    const date = new Date(year, month - 1, day);
    return date && date.getMonth() + 1 == month && date.getDate() == day;
  }
});

// Create validation middleware
const createValidateSchemaMiddleware = async () => {
  try {
    const schemaPath = join(__dirname, '..', 'models', 'planSchema.json');
    const planSchemaJson = await readFile(schemaPath, 'utf8');
    const planSchema = JSON.parse(planSchemaJson);

    if (planSchema.properties?.creationDate) {
      planSchema.properties.creationDate.format = "custom-date";
    }

    const validate = ajv.compile(planSchema);

    return (req, res, next) => {
      const valid = validate(req.body);
      
      if (!valid) {
        const errors = validate.errors.map(err => ({
          field: err.instancePath || 'root',
          message: err.message,
          params: err.params
        }));

        return res.status(400).json({
          error: 'Validation Failed',
          details: errors
        });
      }
      
      next();
    };
  } catch (error) {
    console.error('Schema validation initialization error:', error);
    throw error;
  }
};

export default createValidateSchemaMiddleware;