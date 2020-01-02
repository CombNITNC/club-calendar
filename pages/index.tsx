import { NextPage } from 'next';
import App from '../view/App';

const Index: NextPage<{ root: string }> = ({ root }) => <App root={root} />;

Index.getInitialProps = async ({ req }) => {
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';

  const rootUrl = () => {
    if ('browser' in process) return `${protocol}://${window.location.host}/`;

    if (req != null) return `${protocol}://${req.headers.host}/`;
    return '/';
  };
  return { root: rootUrl() };
};

export default Index;
