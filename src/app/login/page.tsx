import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import LoginForm from './LoginForm';

interface IProps {
  searchParams: {
    callbackUrl?: string;
  };
}

export default async function SignIn(props: IProps) {
  const session = await getServerSession(authOptions);

  return <LoginForm callbackUrl={props.searchParams.callbackUrl || '/'} />;
}
