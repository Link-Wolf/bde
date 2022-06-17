function Header() {
	return (
		<div>
			<div>
				<h1> BDE </h1>
			</div>
			<div class="menu">
				<ul class="drop-down menu">
					<li>
						<ul>
							<a href=".."> Home </a>
						</ul>
						<ul>
							<a href="../event"> Event </a>
						</ul>
						<ul>
							<a href="../shop"> Shop </a>
						</ul>
						<ul>
							<li>
								<ul>
									<a href="../profile"> Profile </a>
								</ul>
								<ul>
									<a href="../login"> Login/Logout </a>
								</ul>
							</li>
						</ul>
					</li>
				</ul>
			</div>
		</div>
	);
}

export default Header;
