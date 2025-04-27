import { Vehicle } from '../types/vehicle';

// Function to format an SQL statement with proper indentation and syntax highlighting
export const generateSQL = (vehicles: Vehicle[]): string => {
  if (vehicles.length === 0) {
    return '';
  }
  
  if (vehicles.length === 1) {
    const vehicle = vehicles[0];
    return `INSERT INTO \`vehicles\` (name, model, price, category) VALUES\n\t('${vehicle.name}','${vehicle.model}',${vehicle.price},'${vehicle.category}');`;
  }
  
  // Multiple vehicles
  let sql = 'INSERT INTO \`vehicles\` (name, model, price, category) VALUES\n';
  
  // Add each vehicle as a row
  const rows = vehicles.map((vehicle, index) => {
    const isLast = index === vehicles.length - 1;
    return `\t('${vehicle.name}','${vehicle.model}',${vehicle.price},'${vehicle.category}')${isLast ? '' : ','}`;
  });
  
  // Join all rows and add final semicolon
  sql += rows.join('\n') + ';';
  
  return sql;
};

// This function creates a formatted HTML version of the SQL for display purposes
// Note: This is just for demonstration - actual implementation would depend on how you want to display it
export const formatSQLForDisplay = (sql: string): string => {
  if (!sql) return '';
  
  // Replace keywords with styled versions
  return sql
    .replace(/INSERT INTO/g, '<span style="color: #a5b4fc;">INSERT INTO</span>')
    .replace(/VALUES/g, '<span style="color: #a5b4fc;">VALUES</span>')
    .replace(/\`vehicles\`/g, '<span style="color: #f472b6;">\`vehicles\`</span>')
    .replace(/(name|model|price|category)/g, '<span style="color: #93c5fd;">$1</span>');
};