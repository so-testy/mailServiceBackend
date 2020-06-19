import User from '../models/user';

export async function register(req, res) {
    const { login, password, additionalAddress } = req.body;

    const existedUser = await User.findOne({
        login
    }).exec();

    if (!existedUser) {
        const user = new User({
            login,
            password,
            additionalAddress
        });

        const newUser = await user.save();

        res.json(newUser);

    } else {

        res.status(400).send({
            error: 'Пользователь с таким логином уже зарегистрирован'
        });
    }
}

export async function login(req, res) {
    res.json(req.user);
}

export async function logout(req, res) {
    req.logout();
    res.status(200).send();
}

export async function profile(req, res) {
    res.json(req.user);
}