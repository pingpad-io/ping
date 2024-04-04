/* eslint-disable react/no-unescaped-entities */
import Head from "next/head";
import { PageLayout } from "~/components/Layout";

const ConditionsPage = () => {
  return (
    <>
      <Head>
        <title>Ping TOS</title>
      </Head>

      <PageLayout>
        <div className="prose dark:prose-invert p-8 lg:prose-lg">
          <h2>Terms of Service</h2>
          <p>By using Ping, you agree to comply with the following legally binding terms and conditions:</p>

          <h4>1. Compliance with Laws</h4>
          <p>
            Users must comply with all applicable US and EU laws while using our app. Any violation of these laws may
            result in the immediate termination of your account, and may also be reported to the relevant authorities.
          </p>

          <h4>2. Intellectual Property</h4>
          <p>
            The app's intellectual property, including its logo, name, website name, and other trademarks, are the
            exclusive property of the app and may not be used or reproduced without our express written consent. Any
            unauthorized use of our intellectual property may result in legal action, including but not limited to civil
            lawsuits and criminal charges.
          </p>

          <h4>3. Reporting Policy Violations</h4>
          <p>
            Users are encouraged to report any violations of our policies to us by emailing{" "}
            <a href="mailto:contact@kualta.dev">contact@kualta.dev</a>. We take all reports of policy violations
            seriously, and may take action against users who violate our policies, up to and including the termination
            of their account.
          </p>

          <h4>4. Disclaimer of Liability</h4>
          <p>
            The app is not responsible for any damage caused by users or content posted on the app. By using our app,
            you acknowledge and agree that you use the app at your own risk, and that we are not liable for any harm or
            damage caused by your use of the app.
          </p>

          <h4>5. Termination of Accounts</h4>
          <p>
            The app reserves the right to terminate any user's account at any time, for any reason, including but not
            limited to violation of our policies or applicable laws.
          </p>

          <p>
            By using our app, you acknowledge and agree to these terms and conditions. If you do not agree to these
            terms, please refrain from using Ping.
          </p>
        </div>
      </PageLayout>
    </>
  );
};

export default ConditionsPage;
