import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
    this.http.get<any[]>('http://localhost:3000/api/chat/all', { headers }).subscribe(data => {
      this.messages = data;
    });
  }

  sendMessage() {
    if (!this.newMessage) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    this.http.post<any>('http://localhost:3000/api/chat', { message: this.newMessage }, { headers })
      .subscribe(res => {
        this.messages.push({ userMessage: this.newMessage, botReply: res.reply });
        this.newMessage = '';
      });
  }
}