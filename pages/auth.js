import { useRef, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

async function createUser(email, password, image) {
	const response = await fetch('/api/auth/signup', {
		method: 'POST',
		body: JSON.stringify({ email, password, image }),
		headers: { 'Content-Type': 'application/json' }
	});

	const data = await response.json();

	if (!response.ok) {
		throw new Error(data.message);
	}

	return data;
}

function Auth() {
	const emailInputRef = useRef(null);
	const passwordInputRef = useRef(null);
	const filePickerRef = useRef(null);
	const router = useRouter();
	const [isLogin, setIsLogin] = useState(false);
	const [imageSrc, setImageSrc] = useState('');
	const [loading, setLoading] = useState(false);

	function switchAuthModeHandler() {
		setIsLogin(prevState => !prevState);
	}

	/**
	 * submitHandler
	 * @description Triggers when the main form is submitted
	 */
	async function submitHandler(event) {
		event.preventDefault();

		const email = emailInputRef.current.value;
		const password = passwordInputRef.current.value;

		if (isLogin) {
			// log user in...
			const result = await signIn('credentials', {
				redirect: false,
				email,
				password
			});
			console.log(result);
			if (result.error) {
				console.log(result.error);
				return;
			}

			router.replace('/');
		} else {
			// create user
			try {
				const data = await createUser(email, password, imageSrc);
				console.log(data);
			} catch (err) {
				console.log(err.message);
			}
		}
	}

	async function handleImage(event) {
		const formData = new FormData();
		formData.append('file', event.target.files[0]);
		formData.append('upload_preset', 'my-uploads');

		setLoading(true);

		const data = await fetch(
			'https://api.cloudinary.com/v1_1/diezkb6ih/image/upload',
			{
				method: 'POST',
				body: formData
			}
		).then(res => res.json());

		setImageSrc(data.secure_url);
		setLoading(false);

		console.log(data);
	}

	return (
		<form
			className='max-w-md mx-auto mt-20 flex flex-col px-6 py-4 border border-gray-200
    rounded-lg shadow-md'
		>
			<h2 className='text-center font-semibold mb-3 text-2xl'>
				{isLogin ? 'Login' : 'Sign Up'}
			</h2>
			{!isLogin && (
				<div className='mb-3'>
					<input
						type='file'
						onChange={handleImage}
						ref={filePickerRef}
						hidden
					/>
					{!loading && !imageSrc && (
						<p
							className='font-semibold text-blue-400 cursor-pointer'
							onClick={() => filePickerRef.current.click()}
						>
							Upload a profile image
						</p>
					)}
					{imageSrc && (
						<img
							src={imageSrc}
							className='h-20 object-contain rounded-lg mt-1 cursor-pointer'
							onClick={() => setImageSrc('')}
						/>
					)}
				</div>
			)}
			<div className='flex flex-col mb-3'>
				<label>Email</label>
				<input type='email' className='input' ref={emailInputRef} />
			</div>
			<div className='flex flex-col'>
				<label>Password</label>
				<input
					type='password'
					className='input'
					ref={passwordInputRef}
				/>
			</div>
			<button onClick={submitHandler} className='btn mt-6'>
				{isLogin ? 'Login' : 'Sign Up'}
			</button>

			<p
				onClick={switchAuthModeHandler}
				className='text-center mt-6 text-purple-500 font-semibold cursor-pointer'
			>
				{isLogin
					? 'Create a new account'
					: 'Login with an existing account'}
			</p>
		</form>
	);
}

export default Auth;
