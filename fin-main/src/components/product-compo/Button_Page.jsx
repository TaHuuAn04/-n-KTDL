import React from 'react';

function SimplePagination({ currentPage, totalPages, onPageChange }) {
    const handlePrevClick = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNextClick = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <div className="simple-pagination d-flex justify-content-center">
            <button onClick={handlePrevClick} disabled={currentPage === 1}>
                Previous
            </button>
            <span className="current-page mx-2">{currentPage}</span>
            <button onClick={handleNextClick} disabled={currentPage === totalPages}>
                Next
            </button>
        </div>
    );
}

export default SimplePagination;