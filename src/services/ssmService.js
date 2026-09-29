const {
  SSMClient,
  GetParametersByPathCommand,
  PutParameterCommand,
  DeleteParameterCommand,
} = require('@aws-sdk/client-ssm');

const clientCache = new Map();

function getClient(region = '') {
  const key = region || '__default__';

  if (!clientCache.has(key)) {
    clientCache.set(
      key,
      new SSMClient(region ? { region } : {})
    );
  }

  return clientCache.get(key);
}

async function getAllParameters({ path = '/', region = '' } = {}) {
  const client = getClient(region);
  const parameters = [];
  let nextToken;

  do {
    const response = await client.send(
      new GetParametersByPathCommand({
        Path: path,
        Recursive: true,
        WithDecryption: true,
        NextToken: nextToken,
      })
    );

    for (const parameter of response.Parameters || []) {
      parameters.push({
        name: parameter.Name || '',
        value: parameter.Value || '',
        type: parameter.Type || 'String',
        version: parameter.Version || '',
        lastModifiedDate: parameter.LastModifiedDate || null,
        arn: parameter.ARN || '',
        dataType: parameter.DataType || 'text',
      });
    }

    nextToken = response.NextToken;
  } while (nextToken);
  
  return parameters.sort((a, b) => a.name.localeCompare(b.name));
}

async function saveParameter({
  name,
  value,
  type = 'String',
  description = '',
  region = '',
}) {
  const allowedTypes = ['String', 'StringList', 'SecureString'];

  if (!allowedTypes.includes(type)) {
    throw new Error('Invalid parameter type.');
  }

  const input = {
    Name: name,
    Value: String(value),
    Type: type,
    region: region,
    Overwrite: true,
  };

  if (description.trim()) {
    input.Description = description.trim();
  }

  return getClient(region).send(new PutParameterCommand(input));
}

async function deleteParameter({ name, region = '' }) {
  return getClient(region).send(
    new DeleteParameterCommand({ Name: name })
  );
}

module.exports = {
  getAllParameters,
  saveParameter,
  deleteParameter,
};
