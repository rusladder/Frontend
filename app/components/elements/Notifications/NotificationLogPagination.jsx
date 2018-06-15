import React from 'react';
import Pagination from "react-paginating";
//
// fixme env or user setting?
const pageCount = 5;
const currentPage = 1;

//
export default function NotificationLogPagination(props) {
    //
    const {currentPageIndex, total, pageSize} = props
    //
    // always visible for now
    return (
        <div className={'golos-card__item'}>
            <Pagination
                total={total}
                limit={pageSize}
                pageCount={pageCount}
                currentPage={currentPageIndex}
            >
                {({
                      pages,
                      currentPage,
                      hasNextPage,
                      hasPreviousPage,
                      previousPage,
                      nextPage,
                      totalPages,
                      getPageItemProps
                  }) => (
                    <div className='nlog__pagination'>
                        <div
                            className={`nav-button`}
                            {...getPageItemProps({
                                pageValue: 1,
                                // onPageChange: this.handlePageChange
                            })}
                        >
                            {`<<`}
                        </div>

                        {/*hasPreviousPage*/ true && (
                            <div
                                className={`nav-button`}
                                {...getPageItemProps({
                                    pageValue: previousPage,
                                    // onPageChange: this.handlePageChange
                                })}
                            >
                                {"<"}
                            </div>
                        )}

                        {pages.map(page => {
                            let activePage = null;
                            const active = currentPage === page;
                            // if () {
                            //     activePage = {backgroundColor: "#fdce09"};
                            // }
                            return (
                                <div
                                    className={`number-button ${active ? 'active' : ''}`}
                                    key={page}
                                    style={activePage}
                                    {...getPageItemProps({
                                        pageValue: page,
                                        // onPageChange: this.handlePageChange
                                    })}
                                >
                                    {page}
                                </div>
                            );
                        })}

                        {/*hasNextPage*/ true && (
                            <div
                                className={`nav-button`}
                                {...getPageItemProps({
                                    pageValue: nextPage,
                                    // onPageChange: this.handlePageChange
                                })}
                            >
                                {">"}
                            </div>
                        )}

                        <div
                            className={`nav-button`}
                            {...getPageItemProps({
                                pageValue: totalPages,
                                // onPageChange: this.handlePageChange
                            })}
                        >
                            {`>>`}
                        </div>
                    </div>
                )}
            </Pagination>
            <div className={'golos-card__divider_horizontal'}></div>
        </div>

    )
}
//
// NotificationLogPagination.propTypes = {
//     children: React.PropTypes.func.isRequired,
// };
