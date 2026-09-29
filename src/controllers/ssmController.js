const ssmService = require('../services/ssmService');
const env = require('../config/env');

function normalizePath(path) {
  const value = String(path || '/').trim() || '/';
  return value.startsWith('/') ? value : `/${value}`;
}

async function index(req, res) {
  const path = normalizePath(req.query.path || env.ssmPath);
  const region = String(req.query.region ?? env.awsRegion).trim();

  try {
    const parameters = await ssmService.getAllParameters({ path, region });

    return res.render('ssm/index', {
      title: 'AWS SSM Parameter Manager',
      parameters,
      path,
      region,
      success: String(req.query.success || ''),
      error: String(req.query.error || ''),
    });
  } catch (error) {
    return res.status(500).render('ssm/index', {
      title: 'AWS SSM Parameter Manager',
      parameters: [],
      path,
      region,
      success: '',
      error: error.message,
    });
  }
}

async function save(req, res) {
  const path = normalizePath(req.body.path || env.ssmPath);
  const region = String(req.body.region ?? env.awsRegion).trim();
  const name = String(req.body.name || '').trim();
  const value = req.body.value;
  const type = String(req.body.type || 'String');
  const description = String(req.body.description || '');

  if (!name || value === undefined || String(value).length === 0) {
    return redirectWithMessage(res, path, region, 'error', 'Parameter name and value are required.');
  }

  if (!name.startsWith('/')) {
    return redirectWithMessage(res, path, region, 'error', 'Parameter name must start with /.');
  }

  try {
    await ssmService.saveParameter({
      name,
      value,
      type,
      description,
      region,
    });

    return redirectWithMessage(res, path, region, 'success', 'Parameter saved successfully.');
  } catch (error) {
    return redirectWithMessage(res, path, region, 'error', error.message);
  }
}

async function remove(req, res) {
  const path = normalizePath(req.body.path || env.ssmPath);
  const region = String(req.body.region ?? env.awsRegion).trim();
  const name = String(req.body.name || '').trim();

  if (!name) {
    return redirectWithMessage(res, path, region, 'error', 'Parameter name is required.');
  }

  try {
    await ssmService.deleteParameter({ name, region });
    return redirectWithMessage(res, path, region, 'success', 'Parameter deleted successfully.');
  } catch (error) {
    return redirectWithMessage(res, path, region, 'error', error.message);
  }
}

async function apiList(req, res, next) {
  try {
    const path = normalizePath(req.query.path || env.ssmPath);
    const region = String(req.query.region ?? env.awsRegion).trim();
    const parameters = await ssmService.getAllParameters({ path, region });

    return res.json({
      success: true,
      count: parameters.length,
      path,
      region: region || 'AWS SDK default',
      data: parameters,
    });
  } catch (error) {
    return next(error);
  }
}

function redirectWithMessage(res, path, region, key, message) {
  const query = new URLSearchParams({ path });
  if (region) query.set('region', region);
  query.set(key, message);
  return res.redirect(`/ssm?${query.toString()}`);
}

module.exports = {
  index,
  save,
  remove,
  apiList,
};
