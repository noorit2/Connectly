import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import classes from "./PaginationControls.module.css";
const PaginationControls = ({ totalPages }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page')) || 1;

    const onPageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            navigate(`?page=${newPage}`);
        }
    };

    return (
        <div className={classes.container}>
            <button 
                onClick={() => onPageChange(currentPage - 1)} 
                disabled={currentPage === 1}
            >
                {"<"} Previous
            </button>
            <p> <span>{currentPage}</span> of {totalPages}</p>
            <button 
                onClick={() => onPageChange(currentPage + 1)} 
                disabled={currentPage === totalPages}
            >
              Next {">"} 
            </button>
        </div>
    );
};

export default PaginationControls;
