from django.shortcuts import render
from django.http import HttpResponseRedirect

def login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        with open('users.txt', 'r') as f:
            for line in f:
                if line.strip() == f"{username}:{password}":
                    return HttpResponseRedirect('/success/')
        return render(request, 'login.html', {'error': 'Invalid username or password'})
    else:
        return render(request, 'login.html')# Create your views here.
    
def base(request):
    return render(request, 'base.html')
