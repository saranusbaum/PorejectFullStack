import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'] 
})
export class ChatComponent implements OnInit {
  messages: any[] = [];
  newMessage = '';
  userName = localStorage.getItem('userName');
isBotTyping = false;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    this.http.get<any[]>(`${environment.baseUrl}/api/chat/all`, { headers }).subscribe(data => {
      this.messages = data;
    });
  }

  sendMessage() {
    if (!this.newMessage) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    this.http.post<any>(`${environment.baseUrl}/api/chat`, { message: this.newMessage }, { headers })
      .subscribe(res => {
        this.messages.push({ userMessage: this.newMessage, botReply: res.reply });
        this.newMessage = '';
      });
  }
}