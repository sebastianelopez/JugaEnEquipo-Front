import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { checkUserEmailPassword } from '../../../api';


export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    
    // ...add more providers here

    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Email: ', type: 'email', placeholder: 'email@google.com'  },
        password: { label: 'Password: ', type: 'password', placeholder: '******'  },
      },
      async authorize(credentials) {
        
        return await checkUserEmailPassword( credentials!.email, credentials!.password );

      }
    }),

  ],

  // Custom Pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  // Callbacks
  jwt: {
    // secret: process.env.JWT_SECRET_SEED, // deprecated
  },
  
  session: {
    maxAge: 2592000, /// 30d
    strategy: 'jwt',
    updateAge: 86400, // cada día
  },


  callbacks: {

    async jwt({ token, account, user }) {      

      if ( account ) {
        token.accessToken = account.access_token;

        switch( account.type ) {

          case 'credentials':
            token.user = user;
          break;
        }

        //here you can add types of accounts logged in by social network, eg: google

      }

      return token;
    },


    async session({ session, token, user }){
      // console.log({ session, token, user });

      session.accessToken = token.accessToken as any;
      session.user = token.user as any;

      return session;
    }
    

  }

});