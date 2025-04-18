# Econnect Product Requirement

# Problem
### Background
- Creating a social platform, that enables job seekers to look for employment, and for companies to hire employees.
### The Problem
- Currently, Ethiopian businesses still use newspapers and word-of-mouth to look for employees, which is inefficient. Simultaneously, many recent university graduates in Ethiopia haven't been able to find employment, because of a lack of experience and lack of access to proper implementation of Resumes and Cover Letters, which are integral to the employment process.
- The Goal of Econnect is to create a medium in which employers and employees can have a unified way of checking applications and enabling them to submit required documentation online, as well as enabling companies to advertise on the website. 
- "A new report by the Ministry of Education reveals only 58 percent of university graduates get jobs in Ethiopia. As many as **42 percent** of university grads are unemployed after graduating."
### Our Approach
- Econnect will provide a system where people can look for jobs and apply for them directly through the website. Companies can make job listings and also advertise for special events that they are possibly hosting (i.e. conventions, exhibitions, networking events)
# Goals & Success
- The goal of this project is to create a mobile and web platform that will help remedy the aforementioned problems. 
- Apart from the business and corporate components of the project, success is defined by the completion of the working product, with possible improvements added later on. 
# Solution
### Features
- The features are broken down into two categories for the two types of users, being "Employees" and "Employers".
- Employers
    - Creating and Logging in to Business accounts 
    - Creating a job listing 
        - Modifying details 
        - Deleting the job listing after enough employees are ascertained 
    - Attaining applications of different possible employees.
    - Dashboard to handle application volume
    - Directly communicating with employee account without needing friend verification
- Employees
    - Creating and Logging in to accounts
    - Creating posts about employee stories and achievements
    - Applying to jobs
    - Adding friends to network and communicate
    - A chat feature that enables communication between possible employers or other employees in companies where they are looking to attain employment.
### User Flows & Mocks
![UserFlow](https://github.com/JohannesSBA/econnect-dev/assets/76441090/fa1aa595-bc9b-42f1-9e76-583e7c7b836c)

### Technical Architecture
# Econnect Technical Design Doc

## Summary
The current application employs a Backend for Frontend (BFF) architecture, utilizing Axios to create API endpoints for handling specific requests. Despite the BFF architecture, there is a direct reliance on Axios for API calls, leading to potential redundancy in code and a blurring of concerns. Specifically, the provided code snippet illustrates a scenario where a friend acceptance feature triggers an Axios API call, which, in turn, invokes a corresponding backend function to update user data.

## Problem
Although the application utilizes a BFF architecture, API endpoints are created to handle requests using Axios, reducing redundant code and creating a separation of concerns. 

```
// Api call to backend (BFF architecture)
async function acceptFriend(email: string, id: string, name: string) {
  try {
    axios.post("/api/friends/accept", { email, id });
  } catch (error) {
    console.log(error)
  } finally {
    router.refresh();
  }
}

//Backend function to handle request

export async function POST(req: Request, res: Response) {
  const body = await req.json();

  try {
    // Update the user's friends list by adding the accepted friend
    await prisma.user.update({
      where: { email: body.email },
      data: {
        friends: {
          connect: { id: body.id },
        },
        pendingFriendRequest: {
          disconnect: { id: body.id },
        },
      },
    });

    return new Response("OK", { status: 200 });
  } catch (error) {
    return new Response("Something Went wrong", { status: 500 });
  }
}

```
## Design
Explain how this feature will be implemented. Highlight the components of your implementation, relationships between components, constraints, etc.

1. **Axios API Calls (Frontend):** Continue to use Axios for making API calls from the front end, maintaining the BFF architecture.
2. **Backend Functions (Node.js/Express):** Implement backend functions to handle specific API endpoints, ensuring a clean separation of concerns. In the given example, the `**POST**`  function manages friend acceptance logic.
3. **Prisma ORM (Database Interaction):** Leverage Prisma ORM for efficient database interactions. In this scenario, the `**prisma.user.update**`  function updates user data based on the accepted friend.
- ![API Flow](https://github.com/JohannesSBA/econnect-dev/assets/76441090/78e8e7e7-5caf-44c9-aea4-c18c3fd7eb3a)

## Constraints
- **API Flow Clarity:** Ensure that the API flow is well-documented and clear to all developers involved in the project.
- **Error Handling:** Implement robust error handling mechanisms for both the front end and back end to handle unexpected scenarios gracefully.
- **Testing Strategy:** Utilize testing frameworks like Jest and React Testing Library to create a comprehensive test plan. This includes unit testing for individual components and integration testing for the entire feature.
## Considerations
### Test plan
- Jest: JavaScript testing framework that provides a complete testing solution for JavaScript applications.
- React Testing Library: a library for testing React components that provides a set of helper functions to interact with the DOM.




- Data model
- System architecture
### Open and Closed Questions
- Scalability?

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## AWS Amplify Deployment

### Build Optimizations

To address build timeout issues in AWS Amplify, the application includes several optimizations:

#### 1. Custom Amplify Configuration (`amplify.yml`)

The project includes a custom `amplify.yml` configuration file that:
- Increases the build timeout to 60 minutes (default is 15 minutes)
- Sets up efficient caching for faster builds
- Handles environment variables properly
- Includes a build monitoring system to prevent timeouts

#### 2. Next.js Build Optimizations

Several Next.js-specific optimizations have been implemented:
- Memory allocation increased to 4GB for Node.js processes
- Webpack cache optimizations to speed up repeated builds
- Package import optimizations for common libraries
- Improved WebSocket support for the custom server
- Properly formatted `outputFileTracingExcludes` as an object (not an array) to avoid Next.js configuration errors

#### 3. Build Monitoring

The project includes a build monitoring system (`build-monitor.js`) that:
- Provides real-time feedback on build progress
- Creates heartbeat signals to prevent idle timeouts
- Detects potential hanging builds
- Reports detailed timing information

#### 4. Optimized Build Script

A custom build script (`build-optimized.js`) is used to:
- Set optimal environment variables for production builds
- Improve logging and error reporting
- Provide more detailed build analytics
- Ensure consistent build environments

### Common Build Issues and Solutions

1. **Configuration Format Errors**:
   - Next.js expects certain configuration properties to be in specific formats
   - `outputFileTracingExcludes` must be an object mapping glob patterns to boolean values (not an array)
   - If you see "Expected object, received array" errors, check your Next.js configuration format

2. **Build Timeouts**:
   - Default Amplify build timeout is 15 minutes, which might not be enough for large applications
   - Ensure your `amplify.yml` includes `buildSpec.timeout: 60` to increase the limit
   - The build monitoring system helps detect and prevent silent timeouts

3. **Memory Issues**:
   - Node.js default memory limit may be too low for large builds
   - The configuration sets `NODE_OPTIONS="--max_old_space_size=4096"` to allocate 4GB of memory

### Deployment Instructions

1. **Commit your changes to Git**:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```

2. **Configure AWS Amplify**:
   - In the AWS Amplify Console, navigate to your app
   - Under "App settings" > "Build settings", ensure the build timeout is set to at least 60 minutes
   - Verify all required environment variables are set

3. **Monitor the Build**:
   - During deployment, you can monitor the build process in the AWS Amplify Console
   - Check for any timeout or memory-related errors
   - Verify all build phases complete successfully

For more information on troubleshooting build issues, see the [AWS Amplify documentation](https://docs.aws.amazon.com/amplify/latest/userguide/build-settings.html).


