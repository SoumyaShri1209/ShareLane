export function corsHeaders(origin = '*') {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
}

export function handleCors(request, allowedOrigins = ['*']) {
  const origin = request.headers.get('origin');
  
  // Check if origin is allowed
  const allowOrigin = allowedOrigins.includes('*') || allowedOrigins.includes(origin)
    ? origin || '*'
    : allowedOrigins[0];

  return {
    headers: corsHeaders(allowOrigin)
  };
}
