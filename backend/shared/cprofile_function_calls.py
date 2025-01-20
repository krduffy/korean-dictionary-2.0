import cProfile
import pstats
from django.http import JsonResponse
from functools import wraps
import io


def cprofile_function_calls(function):

    @wraps(function)
    def cprofile_wrapper(self, request, *args, **kwargs):

        profiler = cProfile.Profile()
        profiler.enable()

        response = function(self, request, *args, **kwargs)

        profiler.disable()
        stats = pstats.Stats(profiler)
        stats.sort_stats("cumulative")

        stats_output = io.StringIO()
        stats.stream = stats_output
        stats.print_stats(10)
        print(stats_output.getvalue())

        return response

    return cprofile_wrapper
