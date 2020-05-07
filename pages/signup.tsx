import SignUpForm from "../components/SignUpForm";
import Layout from "../components/theme/Layout";

export default () => {

    return (
        <Layout>
            <h1>Beta Sign up</h1>
            <SignUpForm
                backLink="/login"
                targetUrl="/"/>
        </Layout>
    );
}
