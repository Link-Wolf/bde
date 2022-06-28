const AdminNavbar = () => {
	return (
		<div>
			<ul>
				<a href="/admin/students">
					<button>Students</button>
				</a>
				<a href="/admin/events">
					<button>Events</button>
				</a>
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
