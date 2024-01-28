import React, { useEffect, useRef, useState } from 'react'
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import { IconButton } from '@mui/material';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import "./App.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const App = () => {
  let closeBtn = useRef();
  let openBtn = useRef()
  const taskInfo = localStorage.getItem('taskInfo');
  const [task, setTask] = useState({ task: "", status: 'Incomplete' })
  const [list, setList] = useState(
    taskInfo?.trim().length ? JSON.parse(taskInfo) : []
  );
  const [search, setSearch] = useState('')
  const [filterOption, setFilterOption] = useState('All');

  const handleClose = () => {
    setTask({ task: "", status: "Incomplete" });
    if (closeBtn.current) {
      closeBtn.current.click();
    }
  }
  const handleOpen = () => {
    if (openBtn.current) {
      openBtn.current.click()
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }))
  }

  const handleClick = () => {
    if (task?.task && task?.status) {
      let isIncludes = list.find((item) => item?.id === task?.id);
      if (isIncludes) {
        let _list = list.map((item) => item?.id === task?.id ? task : item);
        localStorage.setItem('taskInfo', JSON.stringify(_list));
        setList(_list);
        toast.success("Task Edited.");
      }
      else {
        let date = new Date();
        let _task = task;
        _task.id = Date.now();
        _task.time = `${date.toLocaleTimeString()} - ${date.toLocaleDateString()}`;
        let _list = [...list, _task];
        localStorage.setItem('taskInfo', JSON.stringify(_list));
        setList(_list);
        toast.success("Task Added..");
      }
      handleClose();

    } else {
      toast.warning("Please enter task.");
    }
  };

  const handleDelete = (id) => {
    const filterData = list.filter((item) => id !== item.id)
    setList(filterData)
    toast.error("Task Deleted");
  }

  const handleEdit = (id) => {
    handleOpen()
    const editData = list.find((item) => item?.id === id);
    setTask(editData);
  }

  const handleChangeStatus = (id) => {
    const taskInfo = localStorage.getItem('taskInfo');
    if (taskInfo?.trim().length) {
      const updatedItems = JSON.parse(taskInfo).map((val) => {
        if (val.id === id) {
          if (val.status === 'Incomplete') {
            val.status = 'Completed';
          } else {
            val.status = 'Incomplete';
          }
          return val
        } else {
          return val
        }
      });
      let filtered = updatedItems.filter(item => filterOption === "All" ? true : item.status === filterOption);
      setList(filtered);
      localStorage.setItem('taskInfo', JSON.stringify(updatedItems));
    }
  }
  const handleSearch = (e) => {
    setSearch(e.target.value)
  }

  useEffect(() => {
    const taskInfo = localStorage.getItem('taskInfo')
    if (taskInfo?.trim()?.length) {
      let parseItems = JSON.parse(taskInfo);
      if (filterOption === 'All') {
        setList(parseItems);
      } else {

        const filtered = parseItems.filter(item => item.status === filterOption);
        setList(filtered);
      }
    }
  }, [filterOption]);

  useEffect(() => {
    const taskInfo = localStorage.getItem('taskInfo')
    if (taskInfo?.trim()?.length) {
      let parseItems = JSON.parse(taskInfo);
      if (search.trim().length) {
        const itemSearch = parseItems.filter((val) => val?.task.toLowerCase().includes(search) || val?.time.toLowerCase().includes(search))
        setList(itemSearch)
      } else {
        setList(parseItems)
      }
    }
  }, [search]);

  useEffect(() => {
    AOS.init();
  }, [])

  return (
    <>
      <ToastContainer autoClose={1000} position='bottom-right' />
      <h1 className='text-center p-3 mb-2 bg-white text-dark text-capitalize'>TODO LIST </h1>
      <div className="d-flex justify-content-between align-items-center flex-wrap mx-5">
        <div>
          <Button ref={openBtn} variant="outlined" data-bs-toggle="modal" data-bs-target="#staticBackdrop" startIcon={<AddIcon />}>
            Add
          </Button>

        </div>
        <div>
          <input className="form-control" type="search" value={search} onChange={handleSearch} name='search' id='search' placeholder='Search Task...' />
        </div>
        <div>
          <select className="form-select" value={filterOption} onChange={(e) => {
            setFilterOption(e.target.value)
          }}   >
            <option value="All" >All</option>
            <option value="Incomplete">Incomplete</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>
      <div className="container" >
        <div className="modal" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="staticBackdropLabel" >{Object.keys(task).includes('id') ? "Edit" : "Add"} Task</h1>
                <button type="button" className="btn-close" onClick={handleClose} data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="task" className="form-label">Title</label>
                  <input type="text" className="form-control" name='task' value={task?.task} id='task' onChange={handleChange} placeholder="Please enter task." />
                </div>
                <div className="mb-3">
                  <label htmlFor="task" className="form-label">Status</label>
                  <select className="form-select" name="status" id="status" value={task?.status} onChange={handleChange} >
                    <option value="Incomplete">Incomplete</option>
                    <option value="Completed">Completed</option>

                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" ref={closeBtn}
                  onClick={handleClose} data-bs-dismiss="modal" >Close</button>
                <button type="button" onClick={() => handleClick()} className="btn btn-primary">{task?.id ? "Edit " : "Add "}
                  Task
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="list-group">
          {list?.length ?
            <>
              {list.map((val, index) => {
                return (
                  <div key={index} className=" list-group-item list-group-item-action" data-aos="fade-zoom-in" data-aos-offset="200" data-aos-easing="ease-in-sine">
                    <div className='d-flex align-items-start'>
                      <div className="d-flex justify-content-between" style={{ width: "90%" }}>
                        <div className="d-flex gap-3">
                          <input className="form-check-input checkbox-input" name="status" onChange={() => handleChangeStatus(val?.id)} type="checkbox" checked={val?.status === 'Completed' ? true : false} value={val?.status} id="status" />
                          <div>
                            <div className={val?.status === 'Completed' ? 'completed' : null}>
                              {val?.task}
                            </div>
                            <div>{val?.time}</div>
                          </div>
                        </div>
                        <div>
                          <IconButton className='btn' onClick={() => handleEdit(val?.id)} color="info">
                            <ModeEditOutlineIcon />
                          </IconButton>
                          <IconButton className='btn' onClick={() => handleDelete(val?.id)} color="error">
                            <DeleteOutlineIcon />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </>
            :
            <div className="text-center">
              <h4>No Task Found.</h4>
              <Button variant="outlined" data-bs-toggle="modal" data-bs-target="#staticBackdrop" startIcon={<AddIcon />}>
                Add
              </Button>
            </div>
          }
        </div>
      </div>
    </>
  )
}

export default App;
