import jwt from 'jsonwebtoken';
import jwksRsa from 'jwks-rsa';
import { promisify } from 'util'; 

const JWK_PROVIDER_URL = 'https://login.microsoftonline.com/b7dc318e-8abb-4c84-9a6a-3ae9fff0999f/discovery/keys?appid=4a45d2cc-c1a9-4a76-a31b-b4f5101d1b27';

// Create a JWK client
const provider = new jwksRsa.JwksClient({
    jwksUri: JWK_PROVIDER_URL,
    cache: true,
    rateLimit: true,
});

const checkJwt = async (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Get the token from headers

    if (!token) {
        return res.status(401).send("Unauthorized: No token provided");
    }

    try {
        // Decode the JWT to get the `kid` (key ID)
        const decodedHeader = jwt.decode(token, { complete: true });
        const kid = decodedHeader?.header.kid;

        if (!kid) {
            return res.status(401).send("Unauthorized: Token does not contain a key ID");
        }
        console.log(decodedHeader)
        console.log(`Key ID: ${kid}`);

        // Get the signing key
        const jwk = await promisify(provider.getSigningKey.bind(provider))(kid);
        const signingKey = jwk.getPublicKey();

        console.log(signingKey);

        console.log(jwk);

        // Verify the token
        // const verifiedJwt = await promisify(jwt.verify.bind(jwt))(token, signingKey);
        
        let verifiedjwt = jwt.verify(token,signingKey)

        console.log("verified",{verifiedjwt});

        // Date validation
        const now = Math.floor(Date.now() / 1000); // Current time in seconds
        const notBefore = verifiedjwt.nbf ? verifiedjwt.nbf : null;
        const expiresAt = verifiedjwt.exp ? verifiedjwt.exp : null;

        // Check token validity
        if (notBefore && now < notBefore) {
            return res.status(401).send("Unauthorized: Token is not valid yet");
        }
        if (expiresAt && now > expiresAt) {
            return res.status(401).send("Unauthorized: Token has expired");
        }

        // Token is valid, attach user info to the request object
        req.user = verifiedjwt;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).send("Unauthorized: Token is invalid");
    }
};

// Export the middleware
export default checkJwt;

   
   
   // import jwt from "jsonwebtoken";
    // import jwksRsa from "jwks-rsa";

    // // Middleware to validate token
    // const checkJwt = async (req, res, next) => {
    // const token = req.headers.authorization?.split(" ")[1]; // Get the token from headers

    // console.log(token);
    // const decoded = jwt.decode(token);
    // console.log("Decoded JWT:", decoded);

    // if (!token) {
    //     return res.status(401).send("una: No token provided");
    // }


    // // Configure JWKS client to retrieve signing keys from Azure AD
    // const client = jwksRsa({
    //     jwksUri: `https://login.microsoftonline.com/b7dc318e-8abb-4c84-9a6a-3ae9fff0999f/.well-known/openid-configuration`,
    //     cache: true,
    //     rateLimit: true,
    // });

    // try {
    //     // Decode the JWT to get the `kid` (key ID) from the header
    //     const decodedHeader = jwt.decode(token, { complete: true });
    //     const kid = decodedHeader?.header.kid;

    //     if (!kid) {
    //     return res.status(401).send("unaaa: Invalid token");
    //     }

    //     // Get signing key and verify JWT
    //     client.getSigningKey(kid, (err, key) => {
    //     if (err) {
    //         return res.status(401).send("un: Invalid token");
    //     }

    //     const signingKey = key.getPublicKey();

    //     // Asynchronously verify the token
    //     jwt.verify(token, signingKey, (err, decoded) => {
    //         if (err) {
    //         return res.status(401).send("u: Token is invalid");
    //         }

    //         // Token is valid, move to the next middleware
    //         req.user = decoded;
    //         next();
    //     });
    //     });
    // } catch (error) {
    //     console.error("JWT verification error: ", error);
    //     return res.status(401).send("an: Token verification failed");
    // }
    // };

    // export default checkJwt;
