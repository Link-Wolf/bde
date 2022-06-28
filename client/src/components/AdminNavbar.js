import Dropdown from "../components/Dropdown";

const AdminNavbar = () => {
	return (
		<div>
			<ul>
				<a href="/admin/students">
					<button>Students</button>
				</a>
				<Dropdown title="Events">
					<a href="/admin/events/gestion"> Gestion </a>
					<a href="/admin/events/subscribtions"> Inscriptions </a>
				</Dropdown>
				<a href="/admin/contributions">
					<button>Contributions</button>
				</a>
				<a href="/admin/logs">
					<button>Logs</button>
				</a>
			</ul>
		</div>
	);
};

export default AdminNavbar;
