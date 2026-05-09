import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { blogAPI } from "../utils/api";

export default function BlogDetailPage() {
	const { slug } = useParams();
	const { data, isLoading } = useQuery(
		["blog", slug],
		() => blogAPI.getBySlug(slug).then((res) => res.data),
		{
			enabled: !!slug,
		},
	);

	const blog = data?.blog;

	useEffect(() => {
		if (blog) {
			document.title = `${blog.title} | BSK Groups`;
		}
	}, [blog]);

	return (
		<div className="container mx-auto px-4 py-16">
			<Helmet>
				<title>{blog ? `${blog.title} | BSK Groups` : "Blog Detail"}</title>
			</Helmet>
			{isLoading ? (
				<div className="flex justify-center items-center min-h-[40vh]">
					<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
				</div>
			) : blog ? (
				<div>
					<h1 className="text-4xl font-bold mb-4">{blog.title}</h1>
					<p className="text-gray-500 mb-8">{blog.summary}</p>
					<div
						className="prose max-w-none"
						dangerouslySetInnerHTML={{ __html: blog.content }}
					/>
					<Link
						to="/blogs"
						className="inline-block mt-8 text-primary hover:underline"
					>
						← Back to Blogs
					</Link>
				</div>
			) : (
				<div className="text-center py-20">
					<p className="text-xl font-semibold">Blog not found.</p>
					<Link to="/blogs" className="text-primary hover:underline">
						Back to blog listings
					</Link>
				</div>
			)}
		</div>
	);
}
