declare namespace Express {
    interface Request {
        user?: {
            id: string;
            role: string;
        };
    }
}

declare module "express-serve-static-core" {
    interface Request {
        user?: {
            id: string;
            role: string;
        };
    }
}

export { };