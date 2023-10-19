import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from 'next-auth/providers/github'

function getGoogleCredentials() {
    const clientId = process.env.GOOGLE_ID;
    const clientSecret = process.env.GOOGLE_SECRET;

    if (!clientId || clientId.length === 0) {
        throw new Error("Missing GOOGLE_CLIENT_ID");
    }

    if (!clientSecret || clientSecret.length === 0) {
        throw new Error("Missing GOOGLE_CLIENT_SECRET");
    }

    return { clientId, clientSecret };
}

function getGithubCredentials() {
    const clientId = process.env.GITHUB_ID;
    const clientSecret = process.env.GITHUB_SECRET;

    if (!clientId || clientId.length === 0) {
        throw new Error("Missing GITHUB_CLIENT_ID");
    }

    if (!clientSecret || clientSecret.length === 0) {
        throw new Error("Missing GITHUB_CLIENT_SECRET");
    }

    return { clientId, clientSecret };
}


export const options: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: getGoogleCredentials().clientId,
            clientSecret: getGoogleCredentials().clientSecret,
        }),
        GithubProvider({
            clientId: getGithubCredentials().clientId,
            clientSecret: getGithubCredentials().clientSecret,
        })
    ],
    callbacks: {
        redirect() {
            return '/dashboard'
        }
        
    }
    
}