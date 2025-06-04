import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppModule } from '../app.module';

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.css'] 

})
export class NutritionComponent implements OnInit {
  nutritionForm: FormGroup;
  initialGoals: any[] = [];
  initialHealthData: any = null;
  isLoading : boolean=  false;
  showChat = false;
 healthForm: FormGroup;
 isHealthFormSave : boolean = false;
  userName = localStorage.getItem('userName');
  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.healthForm = this.fb.group({
      weight: [null],
      height: [null],
      age: [null],
      gender: [''],
      allergies: ['']
    });

    this.nutritionForm = this.fb.group({
      nutritionGoals: this.fb.array([]),
      healthData: this.fb.group({
        weight: [''],
        height: [''],
        age: [''],
        gender: [''],
        allergies: ['']
      })
    });
  }

    
loadHealthDataAI()
{
  debugger
  this.isLoading = true
     const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    this.http.get<any>('http://localhost:3000/api/chat/initial' ,  { headers }).subscribe(data => {
      
      this.initialGoals = data.nutritionGoals || [];
      this.initialHealthData = data.healthData || {};
      console.log("gggggggg",  this.initialGoals)
       this.isLoading = false
    });
    
}

  ngOnInit() {

    this.loadHealthData()
  }

  get nutritionGoals() {
    return this.nutritionForm.get('nutritionGoals') as FormArray;
  }

  addGoal(goal: any) {
    this.nutritionGoals.push(this.fb.group(goal));
  }

  save() {
    this.http.post('http://localhost:3000/api/chat/save', this.nutritionForm.value).subscribe(() => {
      alert('נתוני התזונה נשמרו');
    });
  }

  toggleChat() {
    this.showChat = !this.showChat;
  }

  loadHealthData() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    this.http.get<any>('http://localhost:3000/api/chat/healthDataGet', { headers }).subscribe(data => {
      if(data)
      {
        this.loadHealthDataAI()
      this.healthForm.patchValue(data);
      }
    });
  }

  saveHealthData() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    const body = {
      ...this.healthForm.value
     // allergies: this.healthForm.value.allergies?.split(',').map((a: string) => a.trim()) // אם זה שדה טקסט
    };

    this.http.post('http://localhost:3000/api/chat/healthData', body, { headers }).subscribe(res => {
      alert('הנתונים נשמרו בהצלחה');
      this.isHealthFormSave = true;
      this.loadHealthDataAI()
    });
  }
  statuses = ['notStarted', 'inProgress', 'completed'];

getStatusLabel(status: string): string {
  switch (status) {
    case 'notStarted': return 'לא התחיל';
    case 'inProgress': return 'בתהליך';
    case 'completed': return 'הושלם';
    default: return status;
  }
}


changeGoalStatus(index: number, newStatus: string) {
    alert(newStatus)

   this.initialGoals[index].status = newStatus;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
  
   console.log("this.initialGoals" ,this.initialGoals)
    this.http.post('http://localhost:3000/api/chat/updateNutritionGoals',  this.initialGoals, { headers }).subscribe(res => {
      debugger
      alert(res.toString());
     // this.isHealthFormSave = true;
     
    });

}


}
