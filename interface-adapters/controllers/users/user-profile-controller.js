module.exports = {
    findAllUsersController: ({ findAllUsersUseCaseHandler, makeHttpError, logEvents }) => {
        return async function findAllUsersControllerHandler() {
            try {
                const users = await findAllUsersUseCaseHandler();
                return {
                    headers: { 'Content-Type': 'application/json' },
                    statusCode: 201,
                    data: JSON.stringify(users),
                };
            } catch (e) {
                logEvents(
                    `${('No:', e.no)}:${('code: ', e.code)}\t${('name: ', e.name)}\t${('message:', e.message)}`,
                    'controllerHandlerErr.log'
                );
                return makeHttpError({ errorMessage: e.message, statusCode: 500 });
            }
        };
    },
    findOneUserController: ({ findOneUserUseCaseHandler, makeHttpError, logEvents }) => {
        return async function findOneUserControllerHandler(httpRequest) {
            const { userId } = httpRequest.params;
            if (!userId) {
                return makeHttpError({ statusCode: 400, errorMessage: 'No user Id provided' });
            }
            try {
                const user = await findOneUserUseCaseHandler({ userId });
                return {
                    headers: { 'Content-Type': 'application/json' },
                    statusCode: 201,
                    data: JSON.stringify(user),
                };
            } catch (e) {
                logEvents(
                    `${('No:', e.no)}:${('code: ', e.code)}\t${('name: ', e.name)}\t${('message:', e.message)}`,
                    'controllerHandlerErr.log'
                );
                return makeHttpError({ errorMessage: e.message, statusCode: 500 });
            }
        };
    },
    updateUserController: ({ updateUserUseCaseHandler, makeHttpError, logEvents }) => {
        return async function updateUserControllerHandler(httpRequest) {
            const { userId } = httpRequest.params;
            const data = httpRequest.body;
            if (!userId || (!Object.keys(data).length && data.constructor === Object)) {
                return makeHttpError({ statusCode: 400, errorMessage: 'No user Id provided' });
            }
            try {
                const updatedUser = await updateUserUseCaseHandler({ userId, ...data });
                return {
                    headers: { 'Content-Type': 'application/json' },
                    statusCode: 201,
                    data: JSON.stringify(updatedUser),
                };
            } catch (e) {
                logEvents(
                    `${('No:', e.no)}:${('code: ', e.code)}\t${('name: ', e.name)}\t${('message:', e.message)}`,
                    'controllerHandlerErr.log'
                );
                return makeHttpError({ errorMessage: e.message, statusCode: 500 });
            }
        };
    },
    deleteUserController: ({ deleteUserUseCaseHandler, makeHttpError, logEvents }) => {
        return async function deleteUserControllerHandler(httpRequest) {
            const { userId } = httpRequest.params;
            if (!userId) {
                return makeHttpError({ statusCode: 400, errorMessage: 'No user Id provided' });
            }
            try {
                const deletedUser = await deleteUserUseCaseHandler({ userId });
                return {
                    headers: { 'Content-Type': 'application/json' },
                    statusCode: 201,
                    data: JSON.stringify(deletedUser),
                };
            } catch (e) {
                logEvents(
                    `${('No:', e.no)}:${('code: ', e.code)}\t${('name: ', e.name)}\t${('message:', e.message)}`,
                    'controllerHandlerErr.log'
                );
                return makeHttpError({ errorMessage: e.message, statusCode: 500 });
            }
        };
    },
    blockUserController: ({ blockUserUseCaseHandler, makeHttpError, logEvents }) =>
        async function blockUserControllerHandler(httpRequest) {
            const { userId } = httpRequest.params;
            if (!userId) {
                return makeHttpError({ statusCode: 400, errorMessage: 'No user Id provided' });
            }
            try {
                const blockedUser = await blockUserUseCaseHandler({ userId });
                return {
                    headers: { 'Content-Type': 'application/json' },
                    statusCode: 201,
                    data: JSON.stringify({ message: 'user blocked successfully', blockedUser }),
                };
            } catch (e) {
                logEvents(
                    `${('No:', e.no)}:${('code: ', e.code)}\t${('name: ', e.name)}\t${('message:', e.message)}`,
                    'controllerHandlerErr.log'
                );
                return makeHttpError({ errorMessage: e.message, statusCode: 500 });
            }
        },
    unBlockUserController: ({ unBlockUserUseCaseHandler, makeHttpError, logEvents }) =>
        async function unBlockUserControllerHandler(httpRequest) {
            const { userId } = httpRequest.params;
            if (!userId) {
                return makeHttpError({ statusCode: 400, errorMessage: 'No user Id provided' });
            }
            try {
                const unBlockedUser = await unBlockUserUseCaseHandler({ userId });
                return {
                    headers: { 'Content-Type': 'application/json' },
                    statusCode: 201,
                    data: JSON.stringify({ message: 'user unblocked successfully', unBlockedUser }),
                };
            } catch (e) {
                logEvents(
                    `${('No:', e.no)}:${('code: ', e.code)}\t${('name: ', e.name)}\t${('message:', e.message)}`,
                    'controllerHandlerErr.log'
                );
                return makeHttpError({ errorMessage: e.message, statusCode: 500 });
            }
        },
};
