## API

__/api/v1/auth/register__           
```
{
    login,
    password,
    additionalAddress
} 

200, 400
```

__/api/v1/auth/login__
```
{
    login,
    password
}

200, 401
```

__/api/v1/auth/profile__           
```
200, 401
```

__/api/v1/email/incoming__
```
{
    mails: [{
        from,
        to,
        subject,
        text|html,
        date
    }]
}
```

__/api/v1/email/outgoing__
```
{
    mails: [{
        from,
        to,
        subject,
        text|html,
        date
    }]
}
```

__/api/v1/email/send__
```
{
    to,
    subject,
    text|html
}
```