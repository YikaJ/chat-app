import LoginForm from './LoginForm';

interface IProps {
  searchParams: {
    callbackUrl?: string;
  };
}

export default async function SignIn(props: IProps) {
  return (
    <div className="container relative h-full flex-col items-center justify-center grid max-w-none grid-cols-2 px-0">
      <div className="relative h-full flex-col bg-muted p-10 text-white flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900"></div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          SSV-AI
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote>
            <p>“你好，世界”</p>
            <footer>yikazhu</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <LoginForm callbackUrl={props.searchParams.callbackUrl || '/'} />
      </div>
    </div>
  );
}
