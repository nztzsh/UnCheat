import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import createTest from '../actions/createTest';
import { connect } from 'react-redux';

class Home extends Component {

    state = {
        examType: 'objective',
        examName: '',
        date: Date.now(),
        duration: 0,
        noOfQues: 0,
        courseName: '',
        courseId: '',
        monitoring: false,
        negativeMarking: false,
        questions: [],
        examinees: [],
        currQues: 1,
        question: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        options: [],
        emails: ''
    }

    handleChange = (e) => {
        this.setState({
            [e.target.id] : e.target.value
        })
    }

    addQuestion = (e) => {
        e.preventDefault();
        
        let optionsList = [{
            optionNo: 'A', option: this.state.optionA, isCorrect: document.getElementById('checkA').checked ? true : false}, {
            optionNo: 'B', option: this.state.optionB, isCorrect: document.getElementById('checkB').checked ? true : false}, {
            optionNo: 'C', option: this.state.optionC, isCorrect: document.getElementById('checkC').checked ? true : false}, {    
            optionNo: 'D', option: this.state.optionD, isCorrect: document.getElementById('checkD').checked ? true : false}
            ];
        this.setState({
            options : optionsList
        }, () => {
            let question = {quesNo: this.state.currQues, ques: this.state.question, options: this.state.options};
            let nextQues = this.state.currQues + 1;
            let quesList = [...this.state.questions, question];
            this.setState({
                currQues : nextQues,
                questions : quesList,
                question : '',
                optionA : '',
                optionB : '',
                optionC : '',
                optionD : '' 
            }, () => {
                if(this.state.currQues <= this.state.noOfQues){
                    window.$("#exam-questionModal").modal();
                }
                else{
                    this.setState({
                        question : '',
                        optionA : '',
                        optionB : '',
                        optionC : '',
                        optionD : ''  
                    });
                    window.$("#exam-questionModal").modal('hide');
                    window.$("#exam-succ-fail-Modal").modal();
                }
            });
        });
    }

    scheduleExam = (e) => {
        e.preventDefault();
        if(this.state.noOfQues > 0){
            window.$("#schedule-examModal").modal('hide');
            window.$("#exam-questionModal").modal();
        }else{
            this.setState({
                examName: '',
                duration: 0,
                noOfQues: 0,
                courseName: '',
                courseId: ''
            });
            window.$("#schedule-examModal").modal('hide');
        }
    }

    createTest = (e) => {
        e.preventDefault();
        let emailList = this.state.emails.split(',');
        if(emailList === ''){
            emailList = this.state.emails;
        }
        this.setState({
            examinees: emailList
        }, () => {
            this.props.createTest(
                this.state.examType,
                this.state.examName,
                this.state.duration,
                this.state.noOfQues,
                this.state.courseName,
                this.state.courseId,
                this.state.monitoring,
                this.state.date,
                this.state.negativeMarking,
                this.state.questions,
                this.state.examinees
            );
            this.setState({
                examName: '',
                duration: 0,
                noOfQues: 0,
                courseName: '',
                courseId: '',
                questions: [],
                examinees: [],
                currQues: 1,
                options: [],
                emails: ''
            });
            window.$("#AddStudentModal").modal('hide');
            window.$("#student-add-succ-fail-Modal").modal();
        });
    }

    render() {
        return(
            <div className = 'home'>
                <nav className="navbar navbar-dark navbar-expand-sm">
                    <div className="container-fluid">
                        <div className="collapse navbar-collapse" id="Navbar">
                            <ul className="navbar-nav ml-auto">
                                <li className="nav-item"><Link className="nav-link" id="navbar-1" to="#">Support</Link></li>
                                <li className="nav-item"><Link className="nav-link" id="navbar-1" to="#">Resources</Link></li>
                                <li className="nav-item"><Link className="nav-link" id="navbar-1" to="#">Request a Demo   </Link></li>
                            </ul>
                        </div>
                    </div>
                    <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#Navbar">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                </nav>
                <nav className="navbar navbar-light navbar-expand-sm fixed">
                    <div className="container-fluid">
                        <Link className="navbar-brand" to="/">UnCheat</Link>
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item dropdown"><a className="nav-link dropdown-toggle" id="navbar-2" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Hello username </a>
                                <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <a className="dropdown-item" id="nav-2-dropdown" href="#">Profile</a>
                                    <a className="dropdown-item" id="nav-2-dropdown" href="#">Change Password</a>
                                    <div className="dropdown-divider"></div>
                                    <a className="dropdown-item" id="nav-2-dropdown" href="/auth/logout">Logout</a>
                                </div>
                            </li>
                            <li className="nav-item"><a className="nav-link" id="navbar-2" href="#">Attend an Exam</a></li>
                            <li className="nav-item"><a className="nav-link" id="navbar-2" href="#">Schedule an Exam</a></li>
                        </ul>
                    </div>
                </nav>

            <div id="schedule-examModal" className="modal fade" role="dialog">
            <div className="modal-dialog modal-lg" role="content">
    
                <div className="modal-content">
                    <div className="modal-header navbar-dark">
                        <h4 className="modal-title">Schedule Exam </h4>
                        <button type="button" className="close modal-header" data-dismiss="modal">&times;</button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit = {this.scheduleExam}>
                            <div className="form-group row">
                            <label for="exam-type" className="col-sm-2 col-form-label">Exam Type</label>
                            <div className="col-sm-10 radio">
                                <label><input type="radio" name="optradio" id="objective-exam" checked /> Objective</label>
                            </div>
                            </div>
                            <div className="form-group row">
                            <label for="exam-name" className="col-sm-2 col-form-label">Exam Name</label>
                            <div className="col-sm-10">
                                <input type="text" id="examName" value = {this.state.examName} onChange = {this.handleChange}/>
                            </div>
                            </div>
                            <div className="form-group row">
                            <label for="date-time" className="col-sm-2 col-form-label">Start Time</label>
                            <div className="col-sm-10">
                                <label><input type="datetime-local" id="date" name="exam-date-time" onChange = {this.handleChange}/> 24 Hour Clock</label>
                            </div>
                            </div>
                            <div className="form-group row">
                            <label for="date-time" className="col-sm-2 col-form-label">Duration</label>
                            <div className="col-sm-10">
                                <label><input type="number" value = {this.state.duration} min="0" id="duration" onChange = {this.handleChange}/> minutes</label>
                            </div>
                            </div>
                            <div className="form-group row">
                            <label for="no-of-questions" className="col-sm-2 col-form-label">No of Quesions</label>
                            <div className="col-sm-10">
                                <label><input type="number" min="0" id="noOfQues" value = {this.state.noOfQues} onChange = {this.handleChange} /></label>
                            </div>
                            </div>
                            <div className="form-group row">
                            <label for="no-of-questions" className="col-sm-2 col-form-label">Course Name and Id</label>
                            <div className="col-sm-10">
                                <input type="text" id="courseName" value = {this.state.courseName} onChange = {this.handleChange}/>
                                <input type="text" id="courseId" value = {this.state.courseId} onChange = {this.handleChange}/>
                            </div>
                            </div>
                            <div className="offset-2">
                            <button type="submit" className="btn btn-primary" id="schedule-exam-next">Next</button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
            </div>
            <div id="exam-questionModal" className="modal fade" role="dialog">
            <div className="modal-dialog modal-lg" role="content">
                
                <div className="modal-content">
                    <div className="modal-header navbar-dark">
                        <h4 className="modal-title">Create Question Paper</h4>
                        <button type="button" className="close modal-header" data-dismiss="modal">&times;</button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit = {this.addQuestion}>
                            <div className="form-group row">
                            <label for="exam-question" className="col-sm-2 col-form-label">Question</label>
                            <div className="col-sm-10 radio">
                                <textarea className="form-control" id="question" value = {this.state.question} onChange = {this.handleChange} rows="3"></textarea>
                            </div>
                            </div>
                            <div className="form-group row">
                            <label for="exam-type" className="col-sm-2 col-form-label">Options</label>
                            <div className="col-sm-10 radio">
                                <label><input type="radio" name="optradio" id="checkA" /> A <input type="text" name="answer" id="optionA" onChange = {this.handleChange} value = {this.state.optionA} /></label><br />
                                <label><input type="radio" name="optradio" id="checkB" /> B  <input type="text" name="answer" id="optionB" onChange = {this.handleChange} value = {this.state.optionB} /></label><br />
                                <label><input type="radio" name="optradio" id="checkC" /> C  <input type="text" name="answer" id="optionC" onChange = {this.handleChange} value = {this.state.optionC} /></label><br />
                                <label><input type="radio" name="optradio" id="checkD" /> D  <input type="text" name="answer" id="optionD" onChange = {this.handleChange} value = {this.state.optionD} /></label>
                            </div>
                            </div>
                            <div className="offset-2">
                            <button type="submit" className="btn btn-primary" id="schedule-exam-submit">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            </div>
            <div id="exam-succ-fail-Modal" className="modal fade" role="dialog">
            <div className="modal-dialog modal-lg" role="content">
                
                <div className="modal-content">
                    <div className="modal-header navbar-dark">
                        <h4 className="modal-title">Success or Failure</h4>
                        <button type="button" className="close modal-header" data-dismiss="modal">&times;</button>
                    </div>
                    <div className="modal-body">
                        <h3>Question Paper Submitted Successfully or failure Report</h3>
                        <br />
                        <button type="submit" onClick = {() => window.$("#AddStudentModal").modal()} className="btn btn-primary offset-5" id="AddStudent" data-dismiss="modal">Add Students For Test</button>
                    </div>
                </div>
            </div>
            </div>
            <div id="AddStudentModal" className="modal fade" role="dialog">
            <div className="modal-dialog modal-lg" role="content">
               
                <div className="modal-content">
                    <div className="modal-header navbar-dark">
                        <h4 className="modal-title">Create Question Paper</h4>
                        <button type="button" className="close modal-header" data-dismiss="modal">&times;</button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit = {this.createTest}>
                            <div className="form-group row">
                            <label for="exam-question" className="col-sm-2 col-form-label">Email Id</label>
                            <div className="col-sm-10 radio">
                                <textarea className="form-control" onChange = {this.handleChange} id="emails" rows="3" placeholder="Email Id's Separated by comma (,) "></textarea>
                            </div>
                            </div>
                            <div className="offset-2">
                            <button type="submit" className="btn btn-primary" id="add-and-invite-students">Add and Invite Students</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            </div>
            
            <div id="student-add-succ-fail-Modal" className="modal fade" role="dialog">
            <div className="modal-dialog modal-lg" role="content">
                
                <div className="modal-content">
                    <div className="modal-header navbar-dark">
                        <h4 className="modal-title">Success or Failure</h4>
                        <button type="button" className="close modal-header" data-dismiss="modal">&times;</button>
                    </div>
                    <div className="modal-body">
                        <h3>Student Add and Invite Successfully or failure Report</h3>
                        <br />
                        <button type="submit" className="btn btn-secondary offset-5" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
            </div>

            <div className="container-fluid">
            <div className="row">
                <div className="col-sm-2" id="side-nav">
                <div className="nav flex-column" role="tablist" aria-orientation="vertical">
                    <p id="side-nav-head">PERSONAL</p>
                    <a className="nav-link side-nav-link" id="v-pills-profile-tab" data-toggle="pill" href="#v-pills-profile" role="tab" aria-controls="v-pills-profile" aria-selected="false">Profile</a>
                    <a className="nav-link side-nav-link" id="v-pills-exams-tab" data-toggle="pill" href="#v-pills-exams" role="tab" aria-controls="v-pills-exams" aria-selected="false">Exams</a>
                    <p id="side-nav-head">ADMIN</p>
                    <p id="side-nav-subhead">User Management</p>
                    <a className="nav-link side-nav-link" id="v-pills-users-tab" data-toggle="pill" href="#v-pills-users" role="tab" aria-controls="v-pills-users" aria-selected="false">Users</a>
                    <a className="nav-link side-nav-link" id="v-pills-groups-tab" data-toggle="pill" href="#v-pills-groups" role="tab" aria-controls="v-pills-groups" aria-selected="false">Groups</a>
                    <p id="side-nav-subhead">Account Management</p>
                    <a className="nav-link side-nav-link" id="v-pills-accountprfl-tab" data-toggle="pill" href="#v-pills-accountprfl" role="tab" aria-controls="v-pills-accountprfl" aria-selected="false">Account Profile</a>
                    <a className="nav-link side-nav-link" id="v-pills-billing-tab" data-toggle="pill" href="#v-pills-billing" role="tab" aria-controls="v-pills-billing" aria-selected="false">Billing</a>
                </div>
                </div>
                <div className="col-sm-10">
                <div className="tab-content" id="v-pills-tabContent">
                    <div className="tab-pane fade" id="v-pills-profile" role="tabpanel" aria-labelledby="v-pills-profile-tab">Profile</div>

                    
                    <div className="tab-pane fade" id="v-pills-exams" role="tabpanel" aria-labelledby="v-pills-exams-tab">
                    <ul className="nav nav-tabs" id="myTab" role="tablist">
                        <li className="nav-item" role="presentation">
                        <a className="nav-link exam-content active" id="upcoming-exams-tab" data-toggle="tab" href="#upcomingexams" role="tab" aria-controls="upcomingexams" aria-selected="true">My Exams</a>
                        </li>
                        <li className="nav-item" role="presentation">
                        <a className="nav-link exam-content" id="previous-exmas-tab" data-toggle="tab" href="#previousexams" role="tab" aria-controls="previousexams" aria-selected="false">Exams Conducted</a>
                        </li>
                    </ul>
                    <div className="tab-content" id="myTabContent">
                        <button type="button" onClick = {() => window.$("#schedule-examModal").modal()} className="btn curve-button btn-primary" id="schedule-exam"><span className="fa fa-calendar fa-lg"></span> Schedule a new Exam</button>
                        <div className="tab-pane fade show  active" id="upcomingexams" role="tabpanel" aria-labelledby="upcoming-exams-tab">
                        
                        <table className="table">
                            <thead className="thead" id="exam-table">
                            <tr>
                                <th scope="col">Exam Name</th>
                                <th scope="col">Course Name</th>
                                <th scope="col">Course Id</th>
                                <th scope="col">Exam Date</th>
                                <th scope="col">Start Time</th>
                                <th scope="col">Duration</th>
                                <th scope="col">Marks</th>
                            </tr>
                            </thead>
                            <tbody>
                            
                            
                            {this.props.examsAttended.map(exam => {
                                return(
                                    <tr key = {exam.examId} onClick = {() => this.props.history.push('/test/' + exam.examId)}>
                                        <td> {exam.examName} </td>
                                        <td> {exam.courseName} </td>
                                        <td> {exam.courseId} </td>
                                        <td> {exam.date} </td>
                                        <td> {exam.time} </td>
                                        <td> {exam.duration} </td>
                                        <td> {exam.marks} </td>
                                    </tr>
                                )
                            })}
                           
                            </tbody>
                        </table>
                        
                        

                        </div>
                        <div className="tab-pane fade " id="previousexams" role="tabpanel" aria-labelledby="previous-exams-tab">
                        
                        <table className="table">
                            <thead className="thead" id="exam-table">
                            <tr>
                            <th scope="col">Exam Name</th>
                                <th scope="col">Course Name</th>
                                <th scope="col">Course Id</th>
                                <th scope="col">Exam Date</th>
                                <th scope="col">Start Time</th>
                                <th scope="col">Duration</th>
                            </tr>
                            </thead>
                            <tbody>
                            
                            {this.props.examsCreated.map(exam => {
                                return(
                                    <tr key = {exam.examId} onClick = {() => this.props.history.push('/test/' + exam.examId)}>
                                        <td> {exam.examName} </td>
                                        <td> {exam.courseName} </td>
                                        <td> {exam.courseId} </td>
                                        <td> {exam.date} </td>
                                        <td> {exam.time} </td>
                                        <td> {exam.duration} </td>
                                        <td> {exam.marks} </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>


                        </div>
                    </div>
                    </div>
                    
                    
                    <div className="tab-pane fade" id="v-pills-users" role="tabpanel" aria-labelledby="v-pills-users-tab">Users</div>
                    <div className="tab-pane fade" id="v-pills-groups" role="tabpanel" aria-labelledby="v-pills-groups-tab">Groups</div>
                    <div className="tab-pane fade" id="v-pills-accountprfl" role="tabpanel" aria-labelledby="v-pills-accountprfl-tab">Account Profile</div>
                    <div className="tab-pane fade" id="v-pills-billing" role="tabpanel" aria-labelledby="v-pills-billing-tab">Billing</div>
                </div>
                </div>
            </div>
            </div>

            <footer className="container-fluid footer">
            <div className="row">
                <div className="col-sm-3">
                <h2 className="footer-h2">UnCheat</h2>
                <p className="footer-brand-line">For Every Student Every Classroom</p>
                <h2 className="footer-h2">About Us</h2>
                <p className="footer-brand-line">Lorem Ipsum Lorem Ipsum Lorem Ipsum</p>
                <p className="footer-brand-line">Lorem Ipsum Lorem Ipsum Lorem Ipsum</p>
                <h2 className="footer-h2">Contact Us</h2>
                <i className="fa fa-phone fa-lg footer-brand-line"></i> +91 123 456 7890<br />
                <i className="fa fa-envelope fa-lg footer-brand-line"></i> <a href="mailto:contact@uncheat.com" className="footer-link">contact@uncheat.com</a>
                </div>
                <div className="col-sm-2">
                <h4 className="footer-h2">Information</h4>
                <a href="" className="footer-link"><i className="fa fa-newspaper-o  footer-brand-line"></i> Blog</a><br />
                <a href="" className="footer-link"><i className="fa fa-user  footer-brand-line"></i>  Our Customers</a><br />
                <a href="" className="footer-link"><i className="fa fa-users  footer-brand-line"></i> Our Team</a><br />
                <a href="" className="footer-link"><i className="fa fa-question-circle  footer-brand-line"></i> Why UnCheat</a><br />
                <a href="" className="footer-link"><i className="fa fa-key  footer-brand-line"></i> Features</a><br />
                <a href="" className="footer-link"><i className="fa fa-graduation-cap  footer-brand-line"></i> Career</a>
                </div>
                <div className="col-sm-2">
                <h4 className="footer-h2">Support</h4>
                <a href="" className="footer-link"><i className="fa fa-user  footer-brand-line"></i>  Account</a><br />
                <a href="" className="footer-link"><i className="fa fa-comments-o  footer-brand-line"></i> Feedback</a><br />
                <a href="" className="footer-link"><i className="fa  fa-address-card footer-brand-line"></i> Contact Us</a><br />
                <a href="" className="footer-link"><i className="fa fa-fighter-jet footer-brand-line"></i> Accessibility</a><br />
                <a href="" className="footer-link"><i className="fa fa-lock  footer-brand-line"></i> Privacy and Security</a><br />
                <a href="" className="footer-link"><i className="fa fa-question  footer-brand-line"></i> How To Videos</a>
                </div>
                <div className="offset-1 col-sm-2">
                <h4 id="footer-mid">Subscribe For More Info</h4>
                <div className="input-group mb-3">
                    <input type="text" className="form-control" placeholder="Email" aria-label="Email" aria-describedby="basic-addon2" />
                    <div className="input-group-append">
                    <button className="btn btn-outline-secondary" type="button"><i className="fa fa-paper-plane"></i></button>
                    </div>
                </div>
                </div>
            </div>
            <div className="row col-12 d-flex justify-content-center">
                <a href="" className="footer-social"><i className="fa fa-facebook fa-lg"></i></a>
                <a href="" className="footer-social"><i className="fa fa-twitter fa-lg"></i></a>
                <a href="" className="footer-social"><i className="fa fa-linkedin fa-lg"></i></a>
                <a href="" className="footer-social"><i className="fa fa-instagram fa-lg"></i></a>
                <a href="" className="footer-social"><i className="fa fa-google fa-lg"></i></a>

            </div>


            </footer>
            </div>
        )
    }

}

const mapStateToProps = (state) => {
    return{
        examsCreated: state.examsCreated,
        examsAttended: state.examsAttended
    }
}

const mapDispatchToProps = (dispatch) => {
    return{
        createTest: (examType, examName, duration, noOfQues, courseName, courseId, monitoring, date, negativeMarking, questions, examinees) => dispatch(createTest(examType, examName, duration, noOfQues, courseName, courseId, monitoring, date, negativeMarking, questions, examinees))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);