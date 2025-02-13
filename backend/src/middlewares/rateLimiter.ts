
const requestCounterByAddress: {[ipAddress in string]: number} = {};

export function simpleRateLimiter(req: Request, res: Response, next: () => void) {
  const ipAddress = req.headers.get("x-forwarded-for");
  if(!ipAddress) {
    res.status(400).send("Missing IP address");
    return;
  };

  if (requestCounterByAddress[ipAddress] === undefined) {
    requestCounterByAddress[ipAddress] = 0;
  }
  requestCounterByAddress[ipAddress] += 1;

  if (requestCounterByAddress[ipAddress] > 10) {
    res.status(429).send("Too many requests from this IP address");
    return;
  }
  next();
}