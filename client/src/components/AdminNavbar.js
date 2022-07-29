import {Navbar, Nav, NavDropdown} from "react-bootstrap";

const AdminNavbar = () => {
	return (
		<Navbar collapseOnSelect bg="secondary" variant="dark">
			<Nav className="me-auto">
				<Nav.Link href="/admin/students">Students</Nav.Link>
				<NavDropdown title="Events">
					<NavDropdown.Item href="/admin/events/gestion">
						Gestion
					</NavDropdown.Item>
					<NavDropdown.Item href="/admin/events/subscribtions">
						Inscriptions
					</NavDropdown.Item>
				</NavDropdown>
				<Nav.Link href="/admin/contributions">Contributions</Nav.Link>
				<Nav.Link href="/admin/logs">Logs</Nav.Link>
			</Nav>
		</Navbar>
	);
};

export default AdminNavbar;
