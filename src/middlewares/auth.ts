// src/middlewares/auth.ts

let _token = '';

// deno-lint-ignore no-explicit-any
export async function auth(ctx: any, next: any) {
    if (!_token) {
        await next();
        return;
    }

    const userToken = ctx.request.headers.get('authorization')?.split(' ')?.[1];

    if (userToken === _token) {
        await next();
        return;
    }

    ctx.response.status = 401;
    ctx.response.body = {
        ...ctx.state.header,
        error: {
            code: 401,
            desc: 'Unauthorized. A valid bearer token is required.',
        },
    };
}

export function initAuth() {
    const token = Deno.env.get('AUTH_TOKEN');
    if (token) {
        if (token.length < 20) {
            throw Error('Variable \'AUTH_TOKEN\' is not of suitable length (20+).');
        }
        _token = token;
    } else {
        console.warn('[ WARN ] Server authentication is DISABLED.');
    }
}
