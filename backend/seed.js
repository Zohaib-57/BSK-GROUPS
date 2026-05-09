import mongoose from "mongoose";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import Property from "./models/Property.js";
import User from "./models/User.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

config({ path: path.resolve(__dirname, ".env") });

const seedData = async () => {
	try {
		await mongoose.connect(process.env.MONGO_URI);
		console.log("Connected to MongoDB for seeding...");

		// Clear existing data
		await User.deleteMany({ email: { $in: ["admin@bskgroup.com", "agent@bskgroup.com"] } });
		await Property.deleteMany({});

		// Create Admin User
		const admin = new User({
			name: "BSK Admin",
			email: "admin@bskgroup.com",
			password: "admin123456",
			role: "admin",
			isVerified: true
		});
		await admin.save();
		console.log("Admin user created.");

		// Create Agent User
		const agent = new User({
			name: "Expert Agent",
			email: "agent@bskgroup.com",
			password: "agent123456",
			role: "agent",
			isVerified: true
		});
		await agent.save();
		console.log("Agent user created.");

		const properties = [
			// PESHAWAR
			{
				title: "Modern 1-Kanal Villa | DHA Phase 1",
				description: "Stunning modern architecture with premium finishes and a lush garden.",
				price: 75000000,
				type: "villa",
				purpose: "sale",
				area: { value: 20, unit: "marla" },
				bedrooms: 5,
				bathrooms: 6,
				location: { address: "Sector F, DHA", city: "Peshawar", area: "DHA" },
				images: [{ url: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800", isMain: true }],
				postedBy: agent._id,
				isFeatured: true,
				isApproved: true
			},
			{
				title: "Luxury Apartment | Hayatabad Heights",
				description: "Spacious 3-bed apartment with mountain views and 24/7 security.",
				price: 22000000,
				type: "apartment",
				purpose: "sale",
				area: { value: 10, unit: "marla" },
				bedrooms: 3,
				bathrooms: 3,
				location: { address: "Phase 6, Hayatabad", city: "Peshawar", area: "Hayatabad" },
				images: [{ url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800", isMain: true }],
				postedBy: agent._id,
				isFeatured: true,
				isApproved: true
			},
			// ISLAMABAD
			{
				title: "Executive Penthouse | Blue Area",
				description: "Exclusive living in the heart of the capital with private elevator access.",
				price: 150000000,
				type: "apartment",
				purpose: "sale",
				area: { value: 1, unit: "kanal" },
				bedrooms: 4,
				bathrooms: 5,
				location: { address: "Blue Area", city: "Islamabad", area: "Blue Area" },
				images: [{ url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800", isMain: true }],
				postedBy: admin._id,
				isFeatured: true,
				isApproved: true
			},
			{
				title: "7 Marla Designer House | G-13",
				description: "Beautifully designed brand new house in a developed sector.",
				price: 45000000,
				type: "house",
				purpose: "sale",
				area: { value: 7, unit: "marla" },
				bedrooms: 4,
				bathrooms: 4,
				location: { address: "Street 42, G-13/2", city: "Islamabad", area: "G-13" },
				images: [{ url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800", isMain: true }],
				postedBy: agent._id,
				isFeatured: false,
				isApproved: true
			},
			{
				title: "Luxury Farmhouse | Bani Gala",
				description: "Expansive green spaces, private pool, and serene environment.",
				price: 180000000,
				type: "farmhouse",
				purpose: "sale",
				area: { value: 8, unit: "kanal" },
				bedrooms: 6,
				bathrooms: 7,
				location: { address: "Hill Road", city: "Islamabad", area: "Bani Gala" },
				images: [{ url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800", isMain: true }],
				postedBy: agent._id,
				isFeatured: true,
				isApproved: true
			},
			// LAHORE
			{
				title: "1 Kanal Modern House | DHA Phase 6",
				description: "State of the art construction with premium basement.",
				price: 95000000,
				type: "house",
				purpose: "sale",
				area: { value: 20, unit: "marla" },
				bedrooms: 5,
				bathrooms: 6,
				location: { address: "Block L, DHA Phase 6", city: "Lahore", area: "DHA" },
				images: [{ url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800", isMain: true }],
				postedBy: agent._id,
				isFeatured: true,
				isApproved: true
			},
			{
				title: "Commercial Plaza | Gulberg III",
				description: "Prime location commercial plaza with high rental yield.",
				price: 250000000,
				type: "office",
				purpose: "sale",
				area: { value: 10, unit: "marla" },
				location: { address: "Main Boulevard", city: "Lahore", area: "Gulberg" },
				images: [{ url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800", isMain: true }],
				postedBy: admin._id,
				isFeatured: true,
				isApproved: true
			},
			{
				title: "Studio Apartment | Goldcrest Views",
				description: "Modern studio with all amenities in DHA Phase 4.",
				price: 15000000,
				type: "apartment",
				purpose: "sale",
				area: { value: 800, unit: "sqft" },
				bedrooms: 1,
				bathrooms: 1,
				location: { address: "DHA Phase 4", city: "Lahore", area: "DHA" },
				images: [{ url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800", isMain: true }],
				postedBy: agent._id,
				isFeatured: false,
				isApproved: true
			},
			// RENTALS
			{
				title: "Furnished 2BR Apartment | Gulberg",
				description: "Move-in ready apartment with high-end furniture.",
				price: 85000,
				type: "apartment",
				purpose: "rent",
				area: { value: 1200, unit: "sqft" },
				bedrooms: 2,
				bathrooms: 2,
				location: { address: "M.M Alam Road", city: "Lahore", area: "Gulberg" },
				images: [{ url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800", isMain: true }],
				postedBy: agent._id,
				isFeatured: false,
				isApproved: true
			},
			{
				title: "Commercial Warehouse | Ring Road",
				description: "Large storage capacity with easy access for heavy vehicles.",
				price: 300000,
				type: "warehouse",
				purpose: "rent",
				area: { value: 2, unit: "kanal" },
				location: { address: "Industrial Area", city: "Peshawar", area: "Ring Road" },
				images: [{ url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800", isMain: true }],
				postedBy: agent._id,
				isFeatured: false,
				isApproved: true
			},
			// PENDING APPROVAL (For Admin Testing)
			{
				title: "Pending Approval House | University Town",
				description: "This property needs admin review.",
				price: 32000000,
				type: "house",
				purpose: "sale",
				area: { value: 10, unit: "marla" },
				bedrooms: 4,
				bathrooms: 4,
				location: { address: "Canal Bank", city: "Peshawar", area: "University Town" },
				images: [{ url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800", isMain: true }],
				postedBy: agent._id,
				isFeatured: false,
				isApproved: false
			}
		];

		for (const p of properties) {
			const prop = new Property(p);
			await prop.save();
		}

		console.log(`✅ Seeded ${properties.length} properties!`);
		console.log("✅ Seeded Admin: admin@bskgroup.com / admin123456");
		console.log("✅ Seeded Agent: agent@bskgroup.com / agent123456");
		process.exit(0);
	} catch (error) {
		console.error("Error:", error);
		process.exit(1);
	}
};

seedData();
