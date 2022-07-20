import React, { useEffect, useState } from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import "./styles.scss";
import axios from "axios";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from '@mui/icons-material/Add';
import moment from "moment";
import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";
import {useSearchParams} from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import { GetMovies } from "../../../../redux/actions/Movies";

const Movies = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useSearchParams()
  const [paginate, setPaginate] = useState({
    page: query.get('page') ?? 1,
    limit: 4
  })
  
  const [movieSchedule, setMovieSchedule] = useState({
    loading: false,
    results: {
      data: []
  }
  });
  const [addQuery, setAddQuery] = useState({
    title: "",
    sortBy: "",
    orderBy: "",
  })


  const [refetch, setRefetch] = useState(false);
  useEffect(() => {
    const { title, sortBy, orderBy } = query
    setMovieSchedule((prevState) => ({
        ...prevState,
        loading: true
    }))
    axios({
        method: 'GET',
        url: `http://localhost:3006/api/v1/movies
        ${title ? `?title=${title}` : ''}
        ${sortBy ? `?sortBy=${sortBy}` : ''}
        ${orderBy ? `&orderBy=${orderBy}` : ''}`,
    }).then((res) => {
        // console.log()
        setMovieSchedule({
            loading: false,
            results: res.data
        })
    })
        .catch((err) => {
            console.log(err)
        })
  }, [refetch, query])
  const [formEditData, setFormEditData] = useState({})
  const [formAddData, setFormAddData] = useState({
    title: "",
    categoryID: "",
    durationHours: "",
    durationMinute: "",
    director: "",
    releaseDate: "",
    cast: "",
    description: "",
    cover: "",
  });

  
  useEffect(() => {
    dispatch(GetMovies(paginate))
  }, [refetch, paginate]);
  const {data, error, loading} = useSelector((state) => state.movies);
  let totalPage = Array(data.totalPage).fill() ?? []
  // if(loading) {
  //   return <div>loading...</div>
  // }
  // if(error) {
  //  return  <div>error</div>
  // }
  const handlePaginate = (page)=> {
    setPaginate((prevState)=>({...prevState, page}))
    query.set('page', page)
    setQuery(query)
  }

  //add
  const handleAddMovie = async (e) => {
    e.preventDefault();
    try {
      const result = await axios({
        method: "POST",
        data: formAddData,
        url: "http://localhost:3006/api/v1/movies",
      });
      if (result.data.status === 200) {
        alert("Successfully Added");
        setRefetch(!refetch);
      } else {
        alert("Failed, Try Again");
      }
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  //delete
  const handleDelete = (movieID) => {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });

    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You will delete this data!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "YES, DELETE IT",
        cancelButtonText: "NO, CANCEL",
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          axios({
            method: "DELETE",
            url: `http://localhost:3006/api/v1/movies/${movieID}`,
          });
          swalWithBootstrapButtons.fire(
            "Deleted!",
            "Your file has been deleted.",
            "success"
          );
          setRefetch(!refetch);
        }
      })
      .catch((error) => {
        alert(error.response.data.message);
      });
  };

  //edit
  const handleEdit = (prevData) => {
    setFormEditData({
      ...prevData,
      releaseDate: moment(prevData.releaseDate).format("YYYY-MM-DD"),
    });
  };
  const handleUpdateMovie = async (e) => {
    e.preventDefault();
    try {
      const result = await axios({
        method: "PATCH",
        data: formEditData,
        url: `http://localhost:3006/api/v1/movies/${formEditData.movieID}/`,
      });
      if (result.data.status === 200) {
        alert("Successfully Added");
        setRefetch(!refetch);
      } else {
        alert("Failed, Try Again");
      }
    } catch (error) {
      alert(error.response.data.message);
      console.log(error);
    }
  };

  

  const Loading = () => {
    <div>Loading...</div>;
  };
  return (
    <div className="movies">
      <hr />
      <div className="top">
        <div className="search">
          <input type="text" placeholder="Search..." onChange={(e) => {
            setAddQuery(prevData => ({
              ...prevData,
              title: e.target.value
            }))
          }}/>
          <SearchOutlinedIcon className="icon" />
        </div>
        <select class="select">
          <option selected className="option">Order By</option>
          <option value="asc" className="option">ASC</option>
          <option value="desc" className="option">DESC</option>
        </select>
      </div>
      <div className="center">
        <button
          className="add-new"
          data-bs-toggle="modal"
          data-bs-target="#addNewMovie"
        >
          Add new movie
        </button>
        <table className="table table-striped caption-top">
          <caption></caption>
          <thead>
            <tr>
              <th>Title</th>
              <th>Genre</th>
              <th>Director</th>
              <th>Release Date</th>
              <th colSpan="2" className="text-center">
                Duration
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
          {!data.results.length ? (
            <Loading />
          ) : (
            data.results.map((movie, index) => {
              return (
                  <tr key={index}>
                    <td>{movie.title}</td>
                    <td>{movie.categoryName}</td>
                    <td>{movie.director}</td>
                    <td>{movie.releaseDate}</td>
                    <td style={{textAlign:'center'}}>{movie.durationHours} hours</td>
                    <td style={{textAlign: 'center'}}>{movie.durationMinute} minute</td>
                    <td className="icon-button">
                      <button onClick={() => handleEdit(movie)} data-bs-toggle="modal" data-bs-target="#editMovie"><EditIcon className="icon" /></button>
                      <button onClick={() => handleDelete(movie.movieID)}><DeleteOutlineIcon className="icon" />
                      </button>
                    </td>
                  </tr>
              );
            })
          )}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div aria-label="Page navigation">
          <ul className="pagination">
          <li className="page-item">
            <a className="page-link" aria-label="Previous">
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
            {totalPage.map((item,index) =>{
              // let page = parseInt(paginate.page)
              return <li className={`page-item`}>
              <button className="page-link" onClick={()=> handlePaginate(index+1)}>
                <span aria-hidden="true">{index+1}</span>
              </button>
            </li>
            })}
            <li className="page-item">
              <a className="page-link" aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>

          </ul>
        </div>
      </div>

      {/* ADD MOVIES */}
      <div
        className="modal fade"
        id="addNewMovie"
        tabIndex="-1"
        aria-labelledby="addNewMovieLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="addNewMovieLabel">
                Add new movie
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={(e) => handleAddMovie(e)}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => {
                      setFormAddData((prevState) => ({
                        ...prevState,
                        title: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Category</label>
                  {/* <select className="form-select" aria-label="Default select example">
                      <option selected>Open this select menu</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </select> */}
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => {
                      setFormAddData((prevState) => ({
                        ...prevState,
                        categoryID: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Duration Hours
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => {
                      setFormAddData((prevState) => ({
                        ...prevState,
                        durationHours: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Duration Minute
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => {
                      setFormAddData((prevState) => ({
                        ...prevState,
                        durationMinute: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Director
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => {
                      setFormAddData((prevState) => ({
                        ...prevState,
                        director: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Release Date
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    onChange={(e) => {
                      setFormAddData((prevState) => ({
                        ...prevState,
                        releaseDate: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Cast
                  </label>
                  <input
                    className="form-control"
                    onChange={(e) => {
                      setFormAddData((prevState) => ({
                        ...prevState,
                        cast: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Description
                  </label>
                  <textarea
                    rows={5}
                    className="form-control"
                    onChange={(e) => {
                      setFormAddData((prevState) => ({
                        ...prevState,
                        description: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Cover
                  </label>
                  <textarea
                    rows={5}
                    className="form-control"
                    onChange={(e) => {
                      setFormAddData((prevState) => ({
                        ...prevState,
                        cover: e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={(e) => handleAddMovie(e)}
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* EDIT MOVIES */}
      <div
        className="modal fade"
        id="editMovie"
        tabIndex="-1"
        aria-labelledby="editMovieLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="editMovieLabel">
                Edit Movies
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={(e) => handleUpdateMovie(e)}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Title
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputEmail1"
                    value={formEditData.title}
                    onChange={(e) => {
                      setFormEditData((prevState) => ({
                        ...prevState,
                        title: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Category
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputPassword1"
                    value={formEditData.categoryID}
                    onChange={(e) => {
                      setFormEditData((prevState) => ({
                        ...prevState,
                        categoryID: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Duration Hours
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputPassword1"
                    value={formEditData.durationHours}
                    onChange={(e) => {
                      setFormEditData((prevState) => ({
                        ...prevState,
                        durationHours: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Duration Minute
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputPassword1"
                    value={formEditData.durationMinute}
                    onChange={(e) => {
                      setFormEditData((prevState) => ({
                        ...prevState,
                        durationMinute: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Director
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputPassword1"
                    value={formEditData.director}
                    onChange={(e) => {
                      setFormEditData((prevState) => ({
                        ...prevState,
                        director: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Release Date
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleInputPassword1"
                    value={formEditData.releaseDate}
                    onChange={(e) => {
                      setFormEditData((prevState) => ({
                        ...prevState,
                        releaseDate: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Cast
                  </label>
                  <input
                    className="form-control"
                    id="exampleInputPassword1"
                    value={formEditData.cast}
                    onChange={(e) => {
                      setFormEditData((prevState) => ({
                        ...prevState,
                        cast: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Description
                  </label>
                  <textarea
                    rows={5}
                    className="form-control"
                    id="exampleInputPassword1"
                    value={formEditData.description}
                    onChange={(e) => {
                      setFormEditData((prevState) => ({
                        ...prevState,
                        description: e.target.value,
                      }));
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Cover
                  </label>
                  <textarea
                    rows={5}
                    className="form-control"
                    id="exampleInputPassword1"
                    value={formEditData.cover}
                    onChange={(e) => {
                      setFormEditData((prevState) => ({
                        ...prevState,
                        cover: e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={(e) => handleUpdateMovie(e)}
                >
                  Save changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movies;
