import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
	return (
		<div className="container mx-auto px-4 py-24 text-center">
			<Helmet>
				<title>Page Not Found | BSK Groups</title>
			</Helmet>
			<h1 className="text-5xl font-bold mb-4">404</h1>
			<p className="text-xl text-gray-600 mb-6">
				The page you are looking for does not exist.
			</p>
			<Link
				to="/"
				className="inline-block rounded-lg bg-primary px-6 py-3 text-white hover:bg-primary-dark transition"
			>
				Go back home
			</Link>
		</div>
	);
}
