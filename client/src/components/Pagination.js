import React, {useState} from "react";

/**
 * @brief Borrowed code for pagination
 */
function usePagination(data, itemsPerPage) {
	const [localData, updateData] = useState(data);
	const [currentPage, setCurrentPage] = useState(1);
	const maxPage = Math.ceil(data.length / itemsPerPage);

	function currentData() {
		const begin = (currentPage - 1) * itemsPerPage;
		const end = begin + itemsPerPage;
		return data.slice(begin, end);
	}

	function next() {
		setCurrentPage(currentPage => Math.min(currentPage + 1, maxPage));
	}

	function prev() {
		setCurrentPage(currentPage => Math.max(currentPage - 1, 1));
	}

	function jump(page) {
		const pageNumber = Math.max(1, page);
		setCurrentPage(currentPage => Math.min(pageNumber, maxPage));
	}

	return {next, prev, jump, currentData, currentPage, maxPage, updateData};
}

export default usePagination;
