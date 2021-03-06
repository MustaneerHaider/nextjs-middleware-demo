import Head from 'next/head';
import { getSession, signOut, useSession } from 'next-auth/react';

export default function Home() {
	const { data: session } = useSession();

	return (
		<>
			<Head>
				<title>Middleware</title>
				<meta
					name='description'
					content='Generated by create next app'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head>

			<div className='h-screen flex items-center justify-center'>
				<div>
					<h1 className='text-5xl font-bold'>PROFILE</h1>

					<img
						src={session.user.image}
						className='h-20 object-contain rounded-md my-4'
					/>

					<h4 className='text-xl'>
						Your Email:{' '}
						<span className='font-semibold'>
							{session.user.email}
						</span>
					</h4>

					<button onClick={signOut} className='btn mt-6 w-full'>
						Sign Out
					</button>
				</div>
			</div>
		</>
	);
}

export async function getServerSideProps(context) {
	const session = await getSession(context);

	return {
		props: {
			session
		}
	};
}
