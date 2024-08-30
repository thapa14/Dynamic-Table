import {useCallback, useState} from "react";

export default function useTable(props) {

    const [orderBy, setOrderBy] = useState(props?.defaultOrderBy || 'name');

    const [order, setOrder] = useState(props?.defaultOrder || 'asc');

    const [page, setPage] = useState(props?.defaultCurrentPage || 0);

    const [rowsPerPage, setRowsPerPage] = useState(props?.defaultRowsPerPage || 50);

    const onSort = useCallback(
        (id) => {
            const isAsc = orderBy === id && order === 'asc';
            if (id !== '') {
                setOrder(isAsc ? 'desc' : 'asc');
                setOrderBy(id);
            }
        },
        [order, orderBy]
    );

    const onChangePage = useCallback((event, newPage) => {
        setPage(newPage);
    }, []);

    const onChangeRowsPerPage = useCallback((event) => {
        setPage(0);
        setRowsPerPage(parseInt(event.target.value, 10));
    }, []);

    return {
        order,
        page,
        orderBy,
        rowsPerPage,
        onSort,
        onChangePage,
        onChangeRowsPerPage,
        setPage,
        setOrder,
        setOrderBy,
        setRowsPerPage,
    };
}