function Header() {
	return (
		<div>
			<div>
				<h1> BDE </h1>
			</div>
			<div class="menu">
				<ul class="drop-down menu">
					<li>
						<a href=".."> Home </a>
					</li>
					<li>
						<a href="../event"> Event </a>
					</li>
					<li>
						<a href="../shop"> Shop </a>
					</li>
					<ul>
						<li>
							<a href="../profile"> Profile </a>
						</li>
						<li>
							<a href="../login"> Login/Logout </a>
						</li>
					</ul>
				</ul>
			</div>
		</div>
	);
}

export default Header;
