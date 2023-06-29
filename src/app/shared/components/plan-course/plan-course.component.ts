import { HostListener, Pipe, PipeTransform, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formElementsIndex } from 'src/app/core/enums/session_window.enum';
import { HomeComponent } from 'src/app/pages/home/home.component';

export interface CourseData {
  date: string;
  startTime: string;
  endTime: string;
  weeklyRepeat: number;
  weekDay: string;
}

@Component({
  selector: 'app-plan-course',
  templateUrl: './plan-course.component.html',
  styleUrls: ['./plan-course.component.scss'],
})
export class PlanCourseComponent {
  @HostListener('document:keydown.escape', ['$keyEvent'])
  escapeEvent(keyEvent: KeyboardEvent) {
    this.renderNO();
  }

  myBoatData: any[];
  pattern: string = '';
  render: boolean = false;
  chosenCoursesList: any[] = [];
  expandCalendar: boolean = false;
  expandedTitle: string = 'CREATE SCHEDULE';
  notExpandedTitle: string = 'CHOOSE DATE AND TIME';

  myCourseData: CourseData;
  inputsFilled = false;

  dataToRender: CourseData[] = [];
  renderCount: number = 0;

  formControl: FormGroup;
  editing: boolean = false;
  editingIndex: number;
  editingIcon = '../../../../assets/icons/drop-down-grey.svg';
  notEditingIcon = '../../../../assets/icons/edit.svg';
  constructor(private c: HomeComponent, private fb: FormBuilder) {
    this.myBoatData = c.getFilteredData();
    // console.log(this.myBoatData);
    // this.formControl = this.fb.group({
    //   date: ['', Validators.required],
    //   startTime: ['', Validators.required],
    //   endTime: ['', Validators.required],
    //   repeat: ['', Validators.required],
    // });

    // setInterval(() => {
    //   console.log(this.chosenCoursesList);
    // }, 5000);
  }

  formSubmit() {
    console.log(this.chosenCoursesList, this.dataToRender);
  }

  checkInputFields() {
    this.myCourseData.weekDay = this.getWeekDayName(
      this.myCourseData.date,
      'en-US'
    );
    for (let key in this.myCourseData) {
      if (
        this.myCourseData[key] === '' ||
        this.myCourseData[key] === 0 ||
        this.myCourseData[key] === undefined
      ) {
        return;
      }
    }
    this.inputsFilled = true;
  }

  editScheduled(data: CourseData, index: number) {
    this.editing = !this.editing;
    this.editingIndex = index;
    console.log(data, this.dataToRender);
  }
  deleteScheduled(data: CourseData) {
    this.dataToRender = this.dataToRender.filter((item) => item !== data);
  }

  onSubmit() {
    this.inputsFilled = false;
    this.myCourseData.weekDay = this.getWeekDayName(
      this.myCourseData.date,
      'en-US'
    );
    this.myCourseData.date = this.myCourseData.date.replace(/-/g, '.');
    this.dataToRender.push(this.myCourseData);
    this.renderCount++;
    // console.log(this.myCourseData, this.dataToRender);
    this.myCourseData = {
      date: '',
      startTime: '',
      endTime: '',
      weeklyRepeat: 0,
      weekDay: '',
    };
  }

  getWeekDayName(date: string, locale: string) {
    const date_ = new Date(date);
    return date_.toLocaleDateString(locale, { weekday: 'long' });
  }

  toggleCalendar() {
    this.inputsFilled = false;
    const calDom = document.getElementById('t');
    if (this.dataToRender.length > 0) {
      calDom.style.setProperty('--border', 'none');
      const imgDom = document.getElementById('img');
      imgDom.style.setProperty('--img-size', '15px');
      const textDom = document.getElementById('title');
      textDom.style.setProperty('--text-size', 'small');
      const imgBack = document.getElementById('calendar');
      imgBack.style.setProperty('--back-rad', '28px');
      this.notExpandedTitle = 'ADD DATE';
    }

    this.expandCalendar = !this.expandCalendar;
    calDom.style.setProperty(
      '--calendar-size',
      this.expandCalendar ? '50%' : '10%'
    );
    this.myCourseData = {
      date: '',
      startTime: '',
      endTime: '',
      weeklyRepeat: 0,
      weekDay: '',
    };
  }

  removeFromList(data: any) {
    this.chosenCoursesList = this.chosenCoursesList.filter((obj) => {
      return obj._id !== data._id;
    });
  }

  addToList(boat: any) {
    this.chosenCoursesList.push(boat);
  }

  exit() {
    this.c.showPlanCourse();
  }

  renderOK() {
    this.render = true;
  }

  renderNO() {
    this.render = false;
  }
}

@Pipe({
  name: 'filterBoats',
})
export class FilterBoatsPipe implements PipeTransform {
  transform(boats: any[][], pattern: string): any[] {
    const flattenedBoats = boats.reduce(
      (acc, boatArray) => acc.concat(boatArray),
      []
    );

    if (!pattern) {
      return flattenedBoats.slice(0, 12);
    }

    const filteredBoats = flattenedBoats.filter((boat) =>
      boat.name.toLowerCase().includes(pattern.toLowerCase())
    );

    return filteredBoats.slice(0, 6);
  }
}
