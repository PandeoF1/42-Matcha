import notFound from '../../assets/not_found.png';

const NotFound = () => {
    return (
        <div className="notFoundPage">
            <img src={notFound} alt="Not found" />
        </div>
    );
}

export default NotFound;