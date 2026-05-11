import { Helmet } from "react-helmet-async";
import styles from "./LiveInventoryPage.module.css";

/** Same ID as in your share URL (between /d/ and /edit). */
const INVENTORY_SHEET_ID = "1E_z9Gu835QclbxwTK1KXqjiDUr6unAjnXztnlWA2jqU";

const SHEET_VIEW_URL = `https://docs.google.com/spreadsheets/d/${INVENTORY_SHEET_ID}/edit?usp=sharing`;
/** Google embed — shows the sheet when it is shared for viewing (link or public). */
const SHEET_EMBED_URL = `https://docs.google.com/spreadsheets/d/${INVENTORY_SHEET_ID}/htmlembed`;

export default function LiveInventoryPage() {
	return (
		<>
			<Helmet>
				<title>Live Inventory | BSK Groups</title>
				<meta
					name="description"
					content="Live property inventory from BSK Groups, synced from our Google Sheet."
				/>
			</Helmet>

			<div className={styles.page}>
				<section className={styles.hero}>
					<div className={styles.container}>
						<h1 className={styles.title}>Live property inventory</h1>
						<p className={styles.subtitle}>
							Availability and listing details are maintained in our master sheet and
							reflected here in real time when you refresh the page.
						</p>
					</div>
				</section>

				<div className={styles.embedSection}>
					<div className={styles.embedWrap}>
						<iframe
							className={styles.embed}
							src={SHEET_EMBED_URL}
							title="BSK Groups live property inventory spreadsheet"
							loading="lazy"
							referrerPolicy="no-referrer-when-downgrade"
							allowFullScreen
						/>
					</div>
					<div className={styles.toolbar}>
						<a
							className={styles.openLink}
							href={SHEET_VIEW_URL}
							target="_blank"
							rel="noopener noreferrer"
						>
							Open in Google Sheets
						</a>
					</div>
					<p className={styles.hint}>
						If nothing loads, set the spreadsheet in Google Sheets to &quot;Anyone with
						the link&quot; can view (Viewer).
					</p>
				</div>
			</div>
		</>
	);
}
